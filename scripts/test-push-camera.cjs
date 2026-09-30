// Integration test: synthetic canvas camera, real local MediaPipe model, no physical webcam.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.TEST_BASE || 'http://127.0.0.1:4176/juan-tixeront';

(async () => {
  const browser = await chromium.launch({
    ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}),
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [], checks = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.cameraTest = { streams: [], frames: 0, requests: [], failure: null, delay: 0, playbackFailure: false };
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (window.cameraTest.playbackFailure) return Promise.reject(new DOMException('Playback denied', 'NotAllowedError'));
      return nativePlay.call(this);
    };
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(...args) {
        super(...args);
        this.addEventListener('message', ({ data }) => {
          if (data.type === 'pose') window.cameraTest.frames++;
        });
      }
    };
    navigator.mediaDevices.enumerateDevices = async () => [
      { kind: 'videoinput', deviceId: 'synthetic-1', label: 'Test camera one' },
      { kind: 'videoinput', deviceId: 'synthetic-2', label: 'Test camera two' },
    ];
    navigator.mediaDevices.getUserMedia = async constraints => {
      const test = window.cameraTest;
      test.requests.push(constraints);
      if (test.failure) throw new DOMException('Test camera failure', test.failure);
      const canvas = document.createElement('canvas');
      canvas.width = 640; canvas.height = 480;
      const context = canvas.getContext('2d');
      let tick = 0;
      const draw = () => {
        context.fillStyle = '#325d70'; context.fillRect(0, 0, 640, 480);
        context.fillStyle = '#ec9378'; context.fillRect((tick++ * 4) % 580, 120, 60, 180);
      };
      draw();
      const stream = canvas.captureStream(15);
      const interval = setInterval(() => {
        if (stream.getTracks().every(track => track.readyState === 'ended')) clearInterval(interval);
        else draw();
      }, 66);
      test.streams.push(stream);
      if (test.delay) await new Promise(resolve => setTimeout(resolve, test.delay));
      return stream;
    };
  });
  const stopped = () => page.waitForFunction(() => window.cameraTest.streams.every(s => s.getTracks().every(t => t.readyState === 'ended')));
  try {
    await page.goto(base + '/projects/push-quest/demo/', { waitUntil: 'networkidle' });
    await page.getByLabel('Camera', { exact: true }).selectOption('synthetic-2');
    await page.getByRole('button', { name: 'Use camera', exact: true }).click();
    await page.waitForFunction(() => window.cameraTest.frames >= 3, {}, { timeout: 60000 });
    assert.equal(await page.locator('.camera-loading').count(), 0);
    assert.equal(await page.locator('.studio-error').count(), 0);
    assert.equal(await page.evaluate(() => window.cameraTest.requests[0].video.deviceId.exact), 'synthetic-2');
    assert.equal(await page.locator('video[aria-label="Local video feed"]').evaluate(v => v.videoWidth), 640);
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    await page.waitForTimeout(500);
    const pausedFrames = await page.evaluate(() => window.cameraTest.frames);
    await page.waitForTimeout(400);
    assert.equal(await page.evaluate(() => window.cameraTest.frames), pausedFrames);
    await page.getByRole('button', { name: 'Resume', exact: true }).click();
    await page.waitForFunction(n => window.cameraTest.frames > n, pausedFrames);
    await page.getByRole('button', { name: 'End session', exact: true }).click();
    await stopped();
    checks.push('Selected camera starts; real MediaPipe processes frames; pause/resume and stop release tracks');

    for (const name of ['NotAllowedError', 'NotFoundError', 'NotReadableError', 'OverconstrainedError']) {
      await page.evaluate(name => { window.cameraTest.failure = name; }, name);
      await page.getByRole('button', { name: 'Use camera', exact: true }).click();
      await page.locator('.studio-error').waitFor();
      assert.ok((await page.locator('.studio-error').innerText()).length > 40);
      assert.equal(await page.locator('.camera-loading').count(), 0);
      assert.ok(await page.getByRole('button', { name: 'Use camera', exact: true }).isEnabled());
    }
    checks.push('Denied permission, missing camera, busy device and unavailable device recover without a stuck loader');

    await page.evaluate(() => { window.cameraTest.failure = null; window.cameraTest.playbackFailure = true; });
    await page.getByRole('button', { name: 'Use camera', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'blocked video playback' }).waitFor(); await stopped();
    await page.evaluate(() => { window.cameraTest.playbackFailure = false; });
    checks.push('Playback permission is distinguished from camera permission after an allowed stream');

    await page.evaluate(() => { window.cameraTest.failure = null; window.cameraTest.delay = 800; });
    await page.getByRole('button', { name: 'Use camera', exact: true }).click();
    await page.getByRole('button', { name: 'End session', exact: true }).click();
    await page.waitForTimeout(1000); await stopped();
    checks.push('Cancelling a pending permission request stops the late stream');

    await page.evaluate(() => { window.cameraTest.delay = 0; });
    await page.route('**/push-quest/pose-worker.js', route => route.abort());
    await page.getByRole('button', { name: 'Use camera', exact: true }).click();
    await page.locator('.studio-error').waitFor(); await stopped();
    assert.equal(await page.locator('.camera-loading').count(), 0);
    await page.unroute('**/push-quest/pose-worker.js');
    checks.push('Failed model startup releases camera and allows retry');

    const before = await page.evaluate(() => window.cameraTest.frames);
    await page.getByRole('button', { name: 'Use camera', exact: true }).click();
    await page.waitForFunction(n => window.cameraTest.frames > n, before, { timeout: 60000 });
    await page.evaluate(() => { const t = window.cameraTest.streams.at(-1).getVideoTracks()[0]; t.stop(); t.dispatchEvent(new Event('ended')); });
    await page.getByRole('alert').filter({ hasText: 'disconnected' }).waitFor(); await stopped();
    checks.push('Camera disconnection is reported, with a fresh retry available');
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    if (process.env.TEST_SCREENSHOT) await page.screenshot({ path: process.env.TEST_SCREENSHOT, fullPage: true });
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ checks, errors }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
