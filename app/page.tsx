import { ParticlesBackground } from "@/components/particles-background"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { SkillsSection } from "@/components/skills-section"
import { ProjectsSection } from "@/components/projects-section"
import { WorksSection } from "@/components/works-section"
import { GamesSection } from "@/components/games-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <ParticlesBackground />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <WorksSection />
        <GamesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
