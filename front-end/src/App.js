import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Question from "./components/Question";
import ShowResult from "./components/ShowResult";
import { useAuth } from "./context/auth";

import { ToastContainer } from "react-toastify";
import Admin from "./components/Admin";
import Error from "./components/Error";
import ExamList from "./components/ExamList";
import LoginWithPhone from "./components/LoginWithPhone";
import Register from "./components/Register";
import Spinner from "./components/Spinner";

function App() {
  const [auth, setauth] = useAuth();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const exam_type = new URLSearchParams(search).get("exam-type");

  return (
    <>
      <ToastContainer />

      <Routes>
        <Route
          exact
          path={auth.token || id ? "/" : "/n"}
          element={<Login />}
        ></Route>
        <Route
          exact
          path={auth.token ? "/home" : "/n"}
          element={<Home />}
        ></Route>
        {/* <Route path="/" element={<PrivateRoute />}> */}
        {/* <Route path="/home" element={<Home />}></Route> */}
        <Route path={`/question`} element={<Question />}></Route>
        <Route path="/result" element={<ShowResult />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/loginWithPhone" element={<LoginWithPhone />} />
        <Route path="/*" element={<Error />} />
        <Route path="/spinner" element={<Spinner />} />
        <Route path="/register" element={<Register />} />
        <Route path="/exams" exact element={<ExamList />} />

        {/* </Route> */}
      </Routes>
    </>
  );
}

export default App;
