import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./inbound-academy-logo.png";

const AdminLogin = (props) => {
  const [credential, setcredential] = useState({ email: "", password: "" });
  let Navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "/api/auth/admin-login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credential.email,
          password: credential.password,
        }),
      }
    );
    const json = await response.json();
    if (json.success) {
      sessionStorage.setItem("token", json.authToken);
      sessionStorage.setItem("user-type", "admin");

      // console.log("authToken", localStorage.getItem('token'))
      Navigate("/home");
      props.showAlert("Logged In successfully", "success");
    } else {
      props.showAlert("Invalid Details", "danger");
    }
  };
  const onChange = (e) => {
    setcredential({ ...credential, [e.target.name]: e.target.value });
  };
  return (
    <div className="login_sign_up_wraper" >
      <div className="signup_form" >
        <div className="logo_otp text-center" >
          <a target="_blank" href="/">
            <img width="170" className="logoc" src={logo} alt="logo" />
          </a>
        </div >
        <form onSubmit={handleSubmit}>
          <div className="form_fields">
            <label htmlFor="email" className="form_label">
              Email address
            </label>
            <input
              type="email"
              className="form_input"
              id="email"
              name="email"
              value={credential.email}
              onChange={onChange}
              aria-describedby="emailHelp"
            />
          </div>
          <div className="form_fields">
            <label htmlFor="password" className="form_label">
              Password
            </label>
            <input
              type="password"
              className="form_input"
              id="password"
              value={credential.password}
              onChange={onChange}
              name="password"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div >
    </div >
  );
};

export default AdminLogin;
