import React from "react";
import logo from "../../assets/logo.svg";
import Button from "@material-ui/core/Button";

const Header = () => {
  return (
    <div>
      <header className="app-header">
        <img src={logo} alt="Movie App Logo" className="header-logo" />
        <div className="login-button">
          <Button variant="contained" color="default">
            Login
          </Button>
        </div>
        <div className="bookshow-button">
          <Button variant="contained" color="primary">
            Book Show
          </Button>
        </div>
      </header>
    </div>
  );
};
export default Header;
