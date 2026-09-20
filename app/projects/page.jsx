import { PageIntro, ContactBand } from "../components/shared";
import ProjectBrowser from "../components/project-browser";
export const metadata = {
  title: "Projects",
  description:
    "Projects in finance, aerospace and data science, with live applications, interactive demos and original reports.",
};
export default function Projects() {
  return (
    <>
      <PageIntro
        number="02"
        eyebrow="Project library"
        title="Projects"
        emphasis="From analysis to application."
      >
        Working applications, engineering designs and research. Explore the
        problem, the decisions and the work behind each project.
      </PageIntro>
      <ProjectBrowser />
      <ContactBand />
    </>
  );
}
