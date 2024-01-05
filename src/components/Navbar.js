import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "./inbound-academy-logo.png";

const Navbar = () => {
  let show_hide = "test";
  let navigator = useNavigate();
  let location = useLocation();
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user-type");
    navigator("/login");
  };

  useEffect(() => {
    if (sessionStorage.getItem("token") === null) {
      navigator("/login");
      show_hide = "custom_hide";
    }
  }, []);

  if (sessionStorage.getItem("token") == null) {
    show_hide = "custom_hide";
  }
  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${show_hide}`}>
      <div className="container-fluid">
        {sessionStorage.getItem("user-type") == "user" ? (
          <Link className="navbar-brand" to="/student-dashboard">
            <img className="logoc" src={logo} s alt="logo" />
          </Link>
        ) : (
          <Link className="navbar-brand p-0" to="/home">
            <img className="logoc" src={logo} alt="logo" />
          </Link>
        )}
        <div className="mobile_btns">
          <button onClick={handleLogout} className="btn mobile_logout">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>&nbsp;Logout
          </button>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bx bx-menu"></i>
          </button>
        </div >
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {sessionStorage.getItem("token") ? (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <Link
                  className={`nav-link dropdown-toggle ${location.pathname === "/" ? "active" : ""
                    }`}
                  aria-current="page"
                  to="/home"
                  id="homeDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bx bxs-dashboard"></i>&nbsp;Questions
                </Link>
                <ul className="dropdown-menu" aria-labelledby="homeDropdown">
                  <li>
                    <Link
                      className={`${location.pathname === "/addquestions" ? "active" : ""
                        }`}
                      aria-current="page"
                      to="/addquestions"
                    >Add Questions
                    </Link>
                    <Link
                      className={`${location.pathname === "/home" ? "active" : ""
                        }`}
                      aria-current="page"
                      to="/home"
                    >Questions List
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle" id="ExmasDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className='bx bx-spreadsheet'></i>&nbsp;Exams
                </Link>
                <ul className="dropdown-menu" aria-labelledby="ExmasDropdown">
                  <li>
                    <Link className={`${location.pathname === "/addexamtype" ? "active" : ""}`} aria-current="page" to="/addexamtype">Add Exam
                    </Link>
                  </li>
                  <li>
                    <Link className={`${location.pathname === "/exams-list" ? "active" : ""}`} aria-current="page" to="/exams-list">
                      Exams List
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/categories-list" ? "active" : ""}`} aria-current="page" to="/categories-list">
                  <i className="bx bx-customize"></i>&nbsp; Categories
                </Link>
              </li >
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle" id="ResultDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bx bxs-analyse"></i>&nbsp;Results
                </Link>
                <ul className="dropdown-menu" aria-labelledby="ResultDropdown">
                  <li>
                    <Link
                      className={`${location.pathname === " /result-list" ? "active" : ""
                        }`}
                      aria-current="page"
                      to="/result-list"
                    >Result
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`${location.pathname === " /examwiseresult" ? "active" : ""
                        }`}
                      aria-current="page"
                      to="/examwiseresult"
                    >Exam wise Result
                    </Link>
                  </li>
                </ul>
              </li>


              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === " /userslist" ? "active" : ""
                    }`}
                  aria-current="page"
                  to="/userslist"
                >
                  <i className='bx bx-user'></i>&nbsp; Users
                </Link>
              </li>

            </ul >
          ) : (
            ""
          )}
          <button onClick={handleLogout} className="btn desktop_logout">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> &nbsp; Logout
          </button >
        </div >
      </div >
    </nav >
  );
};

export default Navbar;
