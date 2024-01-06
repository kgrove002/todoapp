import Footer from "./Footer";
import "./css/About.css";

function About() {
  return (
    <div className="App">
      <div className="About">
        <h1>About This Application!</h1>

        <h2>What is this Application?</h2>
        <p>
          This application is a project done by Kevin Grove. For more
          information about Kevin, you can visit the link,{" "}
          <a href="https://kgrove002.github.io/" target="_blank">
            here
          </a>
          . This application was developed to help individuals manage their time
          and make getting tasks done easier.
        </p>

        <h2>How does it work?</h2>
        <p>
          This application currently works based on your device’s local storage.
          What this means is whatever you save to this application will only
          show up on this device. For this reason, I do recommend that you use
          your mobile device as you will more than likely have that on you more
          than your laptop or desktop computer.{" "}
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default About;
