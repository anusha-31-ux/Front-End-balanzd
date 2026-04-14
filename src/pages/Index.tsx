import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhoIsFor from "@/components/WhoIsFor";
// import Services from "@/components/Services";
// import LiveProgram from "@/components/LiveProgram";
import Trainers from "@/components/Trainers";
import Testimonials from "@/components/Testimonials";
import Transformations from "@/components/Transformations";
import Pricing from "@/components/Pricing";
import PersonalTraining from "@/components/PersonalTraining";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";

/**
 * Index Page
 * Main landing page for the BALANZED fitness website
 */
const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <PromoBanner />
      <Navbar />
      <Hero />
      <Pricing />
      <PersonalTraining />
      <Testimonials />
       <About />
      <WhoIsFor />
      {/* <Services /> */}
      {/* <Transformations /> */}
      <Trainers />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
