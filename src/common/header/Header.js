import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import "./Header.css";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import { Link } from "react-router-dom";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function TabContainer(props) {
  const { index, value, children } = props;
  return (
    <div>
      <div style={{ padding: 0, textAlign: "center" }} hidden={value !== index}>
        {value === index && <div>{children}</div>}
      </div>
    </div>
  );
}

const Header = (props) => {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("access-token")
  );
  const [showModal, setShowModal] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [registerUserForm, setRegisterUserForm] = useState({
    email_address: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    password: "",
  });
  const [reqemail, setReqEmail] = useState("dispNone");
  const [reqfirstname, setReqFirstName] = useState("dispNone");
  const [reqlastname, setReqLastName] = useState("dispNone");
  const [reqmobile, setReqMobile] = useState("dispNone");
  const [reqpass, setReqPass] = useState("dispNone");
  const [username, setUsername] = useState("");
  const [requsername, setReqUserName] = useState("dispNone");
  const [password, setPassword] = useState("");
  const [reqpassword, setReqPassword] = useState("dispNone");
  const [showdisplay, setShowDisplay] = useState("dispNone");

  const inputChangedHandler = (event) => {
    const state = registerUserForm;
    state[event.target.name] = event.target.value;

    setRegisterUserForm({ ...state });
  };

  const inputUserNameHandler = (event) => {
    setUsername(event.target.value);
  };
  const inputPasswordHandler = (event) => {
    setPassword(event.target.value);
  };

  const validateLoginForm = () => {
    username === "" ? setReqUserName("dispBlock") : setReqUserName("dispNone");
    password === "" ? setReqPassword("dispBlock") : setReqPassword("dispNone");
    if (username === "" || password === "") {
      return;
    } else {
      return true;
    }
  };

  const validateRegisterForm = () => {
    registerUserForm.email_address === ""
      ? setReqEmail("dispBlock")
      : setReqEmail("dispNone");
    registerUserForm.first_name === ""
      ? setReqFirstName("dispBlock")
      : setReqFirstName("dispNone");
    registerUserForm.last_name === ""
      ? setReqLastName("dispBlock")
      : setReqLastName("dispNone");
    registerUserForm.mobile_number === ""
      ? setReqMobile("dispBlock")
      : setReqMobile("dispNone");
    registerUserForm.password === ""
      ? setReqPass("dispBlock")
      : setReqPass("dispNone");

    if (
      registerUserForm.email_address === "" ||
      registerUserForm.first_name === "" ||
      registerUserForm.last_name === "" ||
      registerUserForm.mobile_number === "" ||
      registerUserForm.password === ""
    ) {
      return;
    } else {
      return true;
    }
  };

  const onLoginFormSubmitted = () => {
    if (validateLoginForm()) {
      fetch(props.baseUrl + "auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Basic " + window.btoa(username + ":" + password),
        },
      })
        .then((response) => {
          if (response.status === 200) {
            sessionStorage.setItem(
              "access-token",
              response.headers.get("access-token")
            );
            setLoggedIn(sessionStorage.getItem("access-token"));
            closeModal();
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const onFormSubmitted = async (event) => {
    if (validateRegisterForm()) {
      const rawResponse = await fetch(props.baseUrl + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerUserForm),
      });
      const data = await rawResponse.json();
      if (data.status === "ACTIVE") {
        setShowDisplay("dispBlock");
      }
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  Modal.setAppElement("#root");
  const openModal = () => {
    setShowModal(true);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const logoutHandler = async () => {
    const rawResponse = await fetch(props.baseUrl + "/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Basic " + window.btoa(username + ":" + password),
      },
    });
    sessionStorage.removeItem("access-token");
    setLoggedIn(sessionStorage.getItem("access-token"));
    const data = await rawResponse.json();
    console.log(data);
  };

  return (
    <div>
      <header className="app-header">
        <img src={logo} alt="Movie App Logo" className="header-logo" />
        {loggedIn ? (
          <Button
            className="login-button"
            variant="contained"
            color="default"
            onClick={logoutHandler}
          >
            Logout
          </Button>
        ) : (
          <Button
            className="login-button"
            variant="contained"
            color="default"
            onClick={openModal}
          >
            Login
          </Button>
        )}

        {props.showBookShowButton === true && !loggedIn ? (
          <div className="bookshow-button">
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => openModal(true)}
            >
              Book Show
            </Button>
          </div>
        ) : (
          ""
        )}

        {props.showBookShowButton === true && loggedIn ? (
          <div className="bookshow-button">
            <Link to={"/bookshow/" + props.id}>
              <Button variant="contained" color="primary">
                Book Show
              </Button>
            </Link>
          </div>
        ) : (
          ""
        )}
      </header>
      {showModal ? (
        <Modal
          ariaHideApp={false}
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <Tabs
            value={value}
            indicatorColor="secondary"
            onChange={handleChange}
            aria-label="disabled tabs example"
            className="tabs"
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          <TabContainer value={value} index={0}>
            <FormControl required className="form-control">
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="username"
                name="username"
                type="text"
                onChange={inputUserNameHandler}
              />
              <FormHelperText className={requsername}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <FormControl required className="form-control">
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                type="password"
                name="password"
                onChange={inputPasswordHandler}
              />
              <FormHelperText className={reqpassword}>
                <span className="red">required</span>
              </FormHelperText>
            </FormControl>
            <br />
            <br />
            <br />
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={onLoginFormSubmitted}
              >
                Login
              </Button>
            </div>
          </TabContainer>
          <TabContainer value={value} index={1}>
            <div style={{ margin: "20px", padding: "0 20px" }}>
              <FormControl required className="form-control">
                <InputLabel htmlFor="first_name">First Name</InputLabel>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  onChange={inputChangedHandler}
                />
                <FormHelperText className={reqfirstname}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required className="form-control">
                <InputLabel htmlFor="last_name">Last Name</InputLabel>
                <Input
                  refs="last_name"
                  id="last_name"
                  name="last_name"
                  type="text"
                  onChange={inputChangedHandler}
                />
                <FormHelperText className={reqlastname}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required className="form-control">
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  refs="email"
                  id="email"
                  name="email_address"
                  type="text"
                  onChange={inputChangedHandler}
                />
                <FormHelperText className={reqemail}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required className="form-control">
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  refs="password"
                  id="password"
                  name="password"
                  type="password"
                  onChange={inputChangedHandler}
                />
                <FormHelperText className={reqpass}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required className="form-control">
                <InputLabel htmlFor="contact">Contact No.</InputLabel>
                <Input
                  refs="mobile_number"
                  id="mobile_number"
                  name="mobile_number"
                  type="text"
                  onChange={inputChangedHandler}
                />
                <FormHelperText className={reqmobile}>
                  <span className="red">required</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormHelperText
                className={showdisplay}
                style={{ fontSize: "14px", color: "black" }}
              >
                Registration Successful. Please Login!
              </FormHelperText>
              <br />
              <div style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onFormSubmitted}
                >
                  Register
                </Button>
              </div>
            </div>
          </TabContainer>
        </Modal>
      ) : null}
    </div>
  );
};
export default Header;
