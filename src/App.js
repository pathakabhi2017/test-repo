import "./App.css"; 
import { Routes, Route, BrowserRouter } from "react-router-dom";
import QuesState from "./context/ques/QuesState";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import AddQuestions from "./components/AddQuestions";
import AdminLogin from "./components/Admin-Login";
import AddExamType from "./components/AddExamType";
import ResultList from "./components/Results-List";
import QuestionList from "./components/Questions-List";
import CategoriesList from "./components/Categories-List";
import CatesState from "./context/cats/CatesState";
import ExamTypeList from "./components/ExamTypes-List";
import ExamState from "./context/exam/ExamState";
import StudentExamdetails from "./components/StudentExamdetails";
// import { ExportToExcel } from "./components/ExportToExcel";

import React from 'react'
import axios from 'axios'
import ExamWiseResult_List from "./components/ExamWiseResult-List";
import ResultState from "./context/results/ResultsState";
import UsersList from "./components/UsersList";
import UserState from "./context/users/UserState";
import ExamWiseResultDetails from "./components/ExamWiseResultDetails";
import ExamResultState from "./context/examresults/ExamResultState";

function App() {
  const [data, setData] = React.useState([])
  const fileName = "Result Report"; // here enter filename for your excel file
  React.useEffect(() => {

    const fetchData = () => {
      axios.get('/api/ques/getstudentresults').then(postData => {
        const customHeadings = postData.data.map((item) => {
          let object = item;
          Object.entries(item.exam_categories).map(([key, value]) => {
            object[value.name + " Total questions"] = value.attempted;
            object[value.name] = value.correctAnswer;

          })

          return object
        })

        setData(customHeadings)
      })
    }
    fetchData()
  }, [])

  const showAlert = (message, type) => {
    if (type === "danger") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <>

      <div className="App">
        {/* <ExportToExcel apiData={data} fileName={fileName} /> */}
      </div>
      <UserState>
        <QuesState>
          <CatesState>
            <ExamState>
              <ResultState>
                <ExamResultState>
                  <BrowserRouter>
                    <Navbar />

                    <ToastContainer></ToastContainer>
                    <div className="main">
                      <div className="container">
                        <Routes>
                          <Route
                            exact
                            path="/home"
                            element={<QuestionList showAlert={showAlert} />}
                          />
                          <Route
                            exact
                            path="/addquestions"
                            element={<AddQuestions showAlert={showAlert} />}
                          />
                          <Route
                            exact
                            path="/login"
                            element={<AdminLogin showAlert={showAlert} />}
                          />
                          <Route></Route>
                          <Route exact path="/result-list" element={<ResultList showAlert={showAlert} apiData={data} fileName={fileName} />} />
                          <Route exact path="/addexamtype" element={<AddExamType showAlert={showAlert} />} />
                          <Route exact path="/categories-list" element={<CategoriesList showAlert={showAlert} />} />
                          <Route exact path="/exams-list" element={<ExamTypeList showAlert={showAlert} />} />
                          <Route exact path="/studentdetails/:sid" element={<StudentExamdetails showAlert={showAlert} />} />
                          <Route exact path="/examwiseresult" element={<ExamWiseResult_List showAlert={showAlert} />} />
                          <Route exact path="/userslist" element={< UsersList showAlert={showAlert} />} />
                          <Route exact path="/examwiseresultdetails/:eid" element={< ExamWiseResultDetails showAlert={showAlert} />} />

                          {/* <Route exact path="/excel" element={<ExportToExcel showAlert={showAlert} />} /> */}
                        </Routes>
                      </div>
                    </div>


                    {window.location.pathname === "/login" ? (
                      ""
                    ) : (
                      <footer className="text-center">
                        <div className="container">
                          Copyright © 2023.{" "}
                          <a href="https://www.transfunnel.com/" target="_blank">
                            TransFunnel Consulting
                          </a>
                        </div>
                      </footer>
                    )}
                  </BrowserRouter>
                </ExamResultState>
              </ResultState>
            </ExamState>
          </CatesState >
        </QuesState >
      </UserState >


    </>
  );
}

export default App;
