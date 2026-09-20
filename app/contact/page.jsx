import { CalendarDays, Globe2, GraduationCap } from "lucide-react";
import { asset } from "../lib/content";
import { PageIntro } from "../components/shared";
import ContactOptions from "../components/contact-options";
export const metadata = {
  title: "Contact",
  description:
    "Contact Juan Tixeront about finance, aviation and commercial opportunities. Seeking a six-month final-year internship from January 2027.",
};
export default function Contact() {
  return (
    <>
      <PageIntro
        number="04"
        eyebrow="Contact"
        title="A good conversation"
        emphasis="can open a new chapter."
      >
        Interested in an analytical profile with a technical foundation and a
        people-facing ambition? Let’s talk.
      </PageIntro>
      <section className="contact-layout wrap">
        <ContactOptions />
        <aside className="contact-profile">
          <div className="contact-portrait">
            <img
              src={asset("/assets/juan-tixeront-portrait.webp")}
              alt="Juan Tixeront"
              width={1536}
              height={1024}
            />
          </div>
          <h2>Juan Tixeront</h2>
          <p>Aeronautical engineering student</p>
          <ul className="contact-facts">
            <li>
              <CalendarDays size={18} />
              <span>
                Six-month final-year internship<small>From January 2027</small>
              </span>
            </li>
            <li>
              <GraduationCap size={18} />
              <span>
                IPSA Toulouse<small>Engineering Cycle · Vehicles Track</small>
              </span>
            </li>
            <li>
              <Globe2 size={18} />
              <span>
                Franco-Spanish
                <small>Spanish · French · English · Italian</small>
              </span>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
}
