import React, { useCallback } from "react";
import "./header.scss";
import { ReactComponent as Logo } from "../../assets/Logo.svg";

const Header = React.memo(() => {
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="left">
          <Logo className="logo" />
        </div>
        <div className="right">
          <button onClick={() => scrollToSection("users-section")}>
            Users
          </button>
          <button onClick={() => scrollToSection("registration-form")}>
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;
