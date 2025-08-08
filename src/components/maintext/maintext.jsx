import React, { useCallback } from "react";
import "./maintext.scss";

const MainText = React.memo(() => {
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section className="main-text">
      <div className="background">
        <div className="container">
          <div className="text">
            <h1>Test assignment for front-end developer</h1>
            <p>
              What defines a good front-end developer is one that has skilled
              knowledge of HTML, CSS, JS with a vast understanding of User
              design thinking as they'll be building web interfaces with
              accessibility in mind. They should also be excited to learn, as
              the world of Front-End Development keeps evolving.
            </p>
          </div>
          <button onClick={() => scrollToSection("registration-form")}>
            Sign up
          </button>
        </div>
      </div>
    </section>
  );
});

export default MainText;
