import { Helmet } from 'react-helmet-async';
import Hero from "../components/page_elements/Home/Hero";
import Intro from "../components/page_elements/Home/Intro";
import Projects from "../components/page_elements/Home/Projects";
import Services from "../components/page_elements/Home/Services";
import Solutions from "../components/page_elements/Home/Solutions";

function Home() {

  return (
    <>
      <Helmet>
        <title>Home | R.I.E.C</title>
        <meta name="description" content="R.I.E.C is a construction company in Rwanda that provides high-quality construction services." />
      </Helmet>
      {/* Hero Section */}
      <Hero />
      <Intro />
      <Services />
      <Projects />
      <Solutions />
    </>
  );
}

export default Home;