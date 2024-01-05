// export default ShowResult;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";
import Spinner from "./Spinner";

const ShowResult = () => {
  const [auth, setauth] = useAuth();
  const [UserReport, setUserReport] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getUserScore = async () => {
      try {
        const { data } = await axios.post(
          "/api/v2/user-score",
          {
            userId: auth.user._id,
            exam_name: auth.type,
            answer_id: auth.answer_id
          }
        );

        if (data) {
          setUserReport(data);

          setIsLoading(false);
          document.exitFullscreen();
          toast.success(
            `Congratulations  ${auth.user.name}! Your test was completed successfully`
          );

          setauth({ ...auth, token: "" });
          localStorage.clear();
        }
      } catch (error) {
        // console.log(error.message);
        window.location.href = "https://www.inboundacademy.in/";
      }
    };
    getUserScore();
  }, []);
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div class="content_wraper">
          <div class="logo">
            <div class="container">
              <a target="_blank" href="https://www.inboundacademy.in/">
                <img src="images/inbound-academy-logo.webp" alt="Logo" />
              </a>
            </div>
          </div>
          <div class="body_content result_page">
            <div class="container">
              <div class="exam_start">
                <div class="exam_result_gh">
                  <div class="exam_result_header">
                    <div class="exam_name_title">
                      <strong>Assessment Results</strong>
                    </div>
                    {UserReport.marks_Obtained >= UserReport.passing_marks ? (
                      <div class="result_icon text-center pass">
                        <i class="fa-solid fa-circle-check"></i>
                      </div>
                    ) : (
                      <div class="result_icon text-center fail">
                        <i class="fa-solid fa-circle-xmark"></i>
                      </div>
                    )}

                    <div class="exam_tag_line text-center">
                      {UserReport.marks_Obtained >= UserReport.passing_marks
                        ? "Nice job, you passed!"
                        : "sorry you failed please try again"}
                    </div>
                  </div>
                  <div class="exam_score_details">
                    <div class="exam_result_scor_bx">
                      <div class="scor_bx_wrp">
                        <div class="scor_bx">
                          <div class="scor_bx_inner">
                            <h8>YOUR SCORE</h8>
                            <span
                              className={
                                UserReport.marks_Obtained >=
                                  UserReport.passing_marks
                                  ? "pre_score"
                                  : "red_custom"
                              }
                            >
                              {UserReport.user_percentage}%
                            </span>
                            <p>
                              PASSING SCORE: {UserReport.requiredPercentage}%
                            </p>
                          </div>
                        </div>
                        <div class="scor_bx">
                          <div class="scor_bx_inner">
                            <h8>YOUR POINTS</h8>
                            <span
                              className={
                                UserReport.marks_Obtained >=
                                  UserReport.passing_marks
                                  ? "pre_score"
                                  : "red_custom"
                              }
                            >
                              {UserReport.marks_Obtained}
                            </span>
                            <p>PASSING POINTS: {UserReport.passing_marks}</p>
                          </div>
                        </div>
                      </div>
                      <div class="quiz_reviews">
                        <button
                          class="btn"
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          View Result
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer class="text-center">
            <div class="container">
              Copyright © 2023.{" "}
              <a href="https://www.transfunnel.com/" target="_blank">
                TransFunnel Consulting
              </a>
            </div>
          </footer>
        </div>
      )}

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Inbound Academy Assessement Test
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="candidate_dt">
                <span>
                  <span>Candidate Name: </span>
                  <strong>{auth?.user?.name ? auth.user.name : ""}</strong>
                </span>

                <span>
                  <span>Number of Questions Attempted: </span>
                  <strong>{UserReport.total_attempted}</strong>
                </span>
              </div>
              <div class="qustions_result_table">
                <table width="100%" border="0" cellSpacing="0">
                  <thead>
                    <tr>
                      {/* <th>Sr No.</th> */}
                      <th>Subject</th>
                      <th>Attempted</th>
                      <th>Correct Answer</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UserReport?.categoryResult &&
                      Object.entries(UserReport.categoryResult).map(
                        ([key, value]) => (
                          <>
                            <tr>
                              {/* <td>{++index}</td> */}

                              <td className="cat-blog">{value.name}</td>
                              <td className="txtAlnCtr">
                                {value?.attempted ? value?.attempted : 0}
                              </td>
                              <td className="txtAlnCtr">
                                {value?.correctAnswer
                                  ? value?.correctAnswer
                                  : 0}
                              </td>
                              <td className="txtAlnCtr">
                                {value?.correctAnswer
                                  ? value?.correctAnswer
                                  : 0}
                              </td>
                            </tr>
                          </>
                        )
                      )}
                  </tbody>
                  <tr className="total_row">
                    <td>Total</td>
                    <td className="txtAlnCtr">{UserReport.total_attempted}</td>
                    <td className="txtAlnCtr">
                      {UserReport.correctAnswerCount}
                    </td>
                    <td className="txtAlnCtr">{UserReport.marks_Obtained}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowResult;
