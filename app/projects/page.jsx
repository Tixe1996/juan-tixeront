import { PageIntro, ContactBand } from "../components/shared";
import ProjectBrowser from "../components/project-browser";
export const metadata = {
  title: "Projects",
  description:
    "Ten projects in finance, aerospace, data science, numerical methods and strategy, with original reports and a live finance application.",
};
export default function Projects() {
  return (
    <>
      <PageIntro
        number="02"
        eyebrow="Project library"
        title="The thinking is important."
        emphasis="The work makes it real."
      >
        Finance applications, aerospace studies and data science. A collection
        of projects that turn analysis into something tangible.
      </PageIntro>
      <ProjectBrowser />
      <ContactBand />
    </>
  );
}
