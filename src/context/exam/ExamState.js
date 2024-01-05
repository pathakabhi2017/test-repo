import examContext from "./ExamContext";
import { useState } from "react";

const ExamState = (props) => {

  const examInitial = [];
  const [exams, setExams] = useState(examInitial);
  const [StudentName, setStudentName] = useState('');
  const [StudentPhone, setStudentPhone] = useState('');
  const [StudentEmail, setStudentEmail] = useState('');
  //const [ExamCloneStatus, setExamCloneStatus] = useState('');
  const [StudentResult, setStudentresult] = useState(examInitial);

  // Get getResult
  const getExams = async () => {
    // API Call
    const response = await fetch(`/api/exam/fetchallexamtype`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    const json = await response.json();
    //console.log(json)
    setExams(json);
  };



  const getStudentresult = async (e) => {
    const response = await fetch(`/api/examdetails/stuexamdetails/${e}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    }
    );
    const json = await response.json();
    //console.log(json)
    //console.log('test')
    setStudentName(json.result[0].name);
    setStudentPhone(json.result[0].phone);
    setStudentEmail(json.result[0].email);
    setStudentresult(json.result[0].responseanswer);

  }

  // Delete a Note
  const deleteExam = async (id) => {
    // API Call
    const response = await fetch(`/api/exam/deleteExam/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if (json) {
      getExams();
    }


  };



  return (
    <examContext.Provider
      value={{
        exams,
        getExams,
        deleteExam,
        getStudentresult,
        //clonedata,
        // ExamCloneStatus,
        StudentName,
        StudentEmail,
        StudentPhone,
        StudentResult,
      }}
    >
      {props.children}
    </examContext.Provider>
  );
};
export default ExamState;
