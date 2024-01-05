import UserState from "../users/UserState";
import resultContext from "./ExamResultsContext";
import { useState } from "react";

const ExamResultState = (props) => {
  const [ExamResultsData, setExamResultsData] = useState([]);
  const [ExamName, setExamName] = useState([]);
  const [Data, setData] = useState([]);
  // Get examresult details
  const getexamwiseresultdetails = async (e) => {

    const response = await fetch(`/api/examwiseresultsdata/fetchallexamtypesresults/${e}`,
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
    setExamName(json.examName)
    setExamResultsData(json.data);

  };


  // Get examresult details
  const getexportdataexam = async (e) => {

    const response = await fetch(`/api/examwiseresultsdata/fetchallexamtypesresults/${e}`,
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

    setData(json.data);

  };


  return (
    <resultContext.Provider
      value={{
        getexamwiseresultdetails,
        ExamResultsData,
        Data,
        ExamName,
        getexportdataexam
      }}
    >
      {props.children}
    </resultContext.Provider>
  );
};
export default ExamResultState;
