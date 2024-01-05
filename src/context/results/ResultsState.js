import resultContext from "./ResultsContext";
import { useState } from "react";

const ResultState = (props) => {
  //const host = "https://adminhub.inboundacademy.in";
  const host = "http://localhost:4015";
  const examresultInitial = [];
  const examresultdata = [];
  const [ExamResults, setExamResults] = useState(examresultInitial);
  //const [ExamResultsData, setExamResultsData] = useState(examresultdata);

  // Get exams result
  const getexamwiseresult = async () => {

    const response = await fetch(`/api/examwiseresultsdata/fetchallresultwithexam`,
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
    //console.log(json.data)

    setExamResults(json.data);


  };

  // // Get examresult details
  // const getexamwiseresultdetails = async (e) => {
  //   //console.log(`${host}/api/examwiseresultsdata/fetchallresultwithexam/${e}`)
  //   const response = await fetch(`${host}/api/examwiseresultsdata/fetchallexamtypesresults/${e}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Cache-Control": "no-cache",
  //         "Content-Type": "application/json",
  //         "auth-token": sessionStorage.getItem("token"),
  //       },
  //     }
  //   );
  //   const json = await response.json();
  //   //console.log(json.data)

  //   setExamResultsData(json.data);

  // };


  return (
    <resultContext.Provider
      value={{
        ExamResults,
        getexamwiseresult,
        //getexamwiseresultdetails,
        //ExamResultsData
      }}
    >
      {props.children}
    </resultContext.Provider>
  );
};
export default ResultState;
