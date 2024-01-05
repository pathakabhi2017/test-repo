import quesContext from "./QuesContext";
import { useState } from "react";

const QuesState = (props) => {
  const quessInitial = [];
  const resultInitial = [];
  const sturesultInitial = [];
  const [quess, setQuess] = useState(quessInitial);
  const [result, setResult] = useState(resultInitial);
  const [StudentResults, setStudentResults] = useState(sturesultInitial);
  // Get ques
  const getQuess = async () => {
    const queryParams = new URLSearchParams(document.location.search);
    const response = await fetch(`/api/ques/fetchallques`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    //  console.log(json.totalques)
    let NLength = Math.ceil(json.totalques / 10, 10);
    sessionStorage.setItem('ques_page_length', NLength);
    setQuess(json.questions);


  };

  // Add a ques
  const addQues = async (
    question,
    options,
    answer,
    category
  ) => {
    // TODO: API Call
    // API Call
    const response = await fetch(`/api/ques/addques`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        question,
        options,
        answer,
        category,
      }),
    });

    const ques = await response.json();
    setQuess(quess.concat(ques));
    // console.log(ques, "ADD")
  };

  // Delete a Note
  const deleteQues = async (id) => {
    // API Call
    const response = await fetch(`/api/ques/deleteQues/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    const json = response.json();

    // const newQuess = quess.filter((ques) => {
    //   return ques._id !== id;
    // });
    if (json) {
      getQuess();
    }
    //setQuess(newQuess);
  };

  // Edit a Ques
  const editQuess = async (
    id,
    question,
    options,
    answer,
    category
  ) => {
    // API Call
    const response = await fetch(`/api/ques/updateques/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        question,
        options,
        answer,
        category,
      }),
    });
    const json = await response.json();

    await getQuess();
  };

  // Get getResult
  const getResult = async () => {
    // API Call
    const response = await fetch(`/api/ques/fetchallresult`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    const json = await response.json();

    //console.log("GET ALL Results", json);
    // console.log("authToken", sessionStorage.getItem('token'))
    window.value = json[0].user;

    setResult(json);
  };

  // Get getResult
  const getStudentResults = async () => {
    // API Call
    const response = await fetch(`/api/ques/getstudentresults`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    const json = await response.json();

    //console.log("GET ALL Results Student", json);
    // console.log("authToken", sessionStorage.getItem('token'))
    //window.value = json[0].user;

    setStudentResults(json);
  };

  return (
    <quesContext.Provider
      value={{
        quess,
        addQues,
        deleteQues,
        editQuess,
        getQuess,
        result,
        getResult,
        StudentResults,
        getStudentResults
      }}
    >
      {props.children}
    </quesContext.Provider>
  );
};
export default QuesState;
