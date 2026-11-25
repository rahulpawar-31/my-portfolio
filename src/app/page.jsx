export const revalidate = 300;
import Hero from "@/components/Hero";
import Skil from "@/components/Skill";
import Experience from "@/components/Experience";
import Project from "@/components/Project";
import GitHubActivity from "@/components/GitHubActivity";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Skil />
      <Experience />
      <Project />
      <GitHubActivity />
      <Contact />
      <Footer />
    </>
  );
}
