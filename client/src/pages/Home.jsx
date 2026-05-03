import Banner from "../components/home/Banner";
import CallToAction from "../components/home/CallToAction";
import FeatureSection from "../components/home/FeatureSection";
import Footer from "../components/home/Footer";
import HeroSection from "../components/home/HeroSection";
import Testimonial from "../components/home/Testimonial";

const Home = () => {
  return (
    <div>
      <Banner />
      <HeroSection />
      <FeatureSection />
      <Testimonial />
      <CallToAction />
      <Footer/>
    </div>
  );
};

export default Home;
