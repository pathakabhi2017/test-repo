import React, { useEffect, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import quesContext from "../context/ques/QuesContext";
import Quesitem from "./QuestionsItem";

const Questions = (props) => {
  const context = useContext(quesContext);
  const { quess, getQuess, editQuess } = context;
  let navigate = useNavigate();
  const getlatestques = (value) => {
    // console.log(value);
    navigate(`?page=${value}`);
    getQuess();
  };
  const queryParams = new URLSearchParams(document.location.search);
  const page = queryParams.get("page");
  useEffect(() => {
    if (
      sessionStorage.getItem("token") === null ||
      sessionStorage.getItem("user-type") === "admin"
    ) {
      getQuess();
    } else {
      navigate("/");
    }

  }, []);

  const Queslength = sessionStorage.getItem('ques_page_length');
  const ref = useRef(null);
  const refClose = useRef(null);

  const [ques, setQues] = useState({
    id: "",
    equestion: "",
    eoption1: "",
    eoption2: "",
    eoption3: "",
    eoption4: "",
    eanswer: "",
    user: "",
  });

  const updateQues = (currentQues) => {
    ref.current.click();
    setQues({
      id: currentQues._id,
      equestion: currentQues.question,
      eoption1: currentQues.options[0],
      eoption2: currentQues.options[1],
      eoption3: currentQues.options[2],
      eoption4: currentQues.options[3],
      eanswer: currentQues.answer,
    });

  };

  const handleClick = (e) => {

    editQuess(
      ques.id,
      ques.equestion,
      ques.eoption1,
      ques.eoption2,
      ques.eoption3,
      ques.eoption4,
      ques.eanswer
    );
    refClose.current.click();
    props.showAlert("Updated Successfully", "success");
  };

  const onChange = (e) => {
    setQues({ ...ques, [e.target.name]: e.target.value }); //whatever value inside the note object will exist as it is but jo properties aage likhi ja rhi hai inko add ya overwrite kar dena
  };

  let QueslengthList = [];

  for (let i = 1; i <= Queslength; i++) {
    QueslengthList.push(
      <li className={page === i ? "active" : ""} key={i}>
        {" "}
        <button onClick={() => getlatestques(i)}>{i}</button>
      </li>
    );
  }


  return (
    <>
      {/* <!-- Button trigger modal --> */}
      <button
        type="button"
        className="btn btn-primary d-none"
        ref={ref} //use to give references
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo
      </button>
      {/* <!-- Modal --> */}

      <div
        className="modal fade bd-example-modal-lg"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="qustion_page_title">
                <h2 className="m-0">Edit Question</h2>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="signup_form add_question_form popup_form">
                <div className="qs_form">
                  <div className="form_fields">
                    <label htmlFor="title" className="form_label">
                      {" "}
                      Question{" "}
                    </label>
                    <input
                      type="text"
                      id="equestion"
                      name="equestion"
                      value={ques.equestion}
                      onChange={onChange}
                      minLength={2}
                      required
                      placeholder="Enter the question"
                    />
                  </div>
                  <div className="form_fields">
                    <label htmlFor="tag" className="form_label">
                      {" "}
                      option1{" "}
                    </label>
                    <input
                      type="text"
                      id="eoption1"
                      name="eoption1"
                      value={ques.eoption1}
                      onChange={onChange}
                      minLength={2}
                      required
                      placeholder="Enter the option1"
                    />
                  </div>
                  <div className="form_fields">
                    <label htmlFor="tag" className="form_label">
                      {" "}
                      option2{" "}
                    </label>
                    <input
                      type="text"
                      id="eoption2"
                      name="eoption2"
                      value={ques.eoption2}
                      onChange={onChange}
                      minLength={3}
                      required
                      placeholder="Enter the option2"
                    />
                  </div>
                  <div className="form_fields">
                    <label htmlFor="tag" className="form_label">
                      {" "}
                      option3{" "}
                    </label>
                    <input
                      type="text"
                      id="eoption3"
                      name="eoption3"
                      value={ques.eoption3}
                      onChange={onChange}
                      minLength={3}
                      required
                      placeholder="Enter the option3"
                    />
                  </div>
                  <div className="form_fields">
                    <label htmlFor="tag" className="form_label">
                      {" "}
                      option4{" "}
                    </label>
                    <input
                      type="text"
                      id="eoption4"
                      name="eoption4"
                      value={ques.eoption4}
                      onChange={onChange}
                      minLength={3}
                      required
                      placeholder="Enter the option4"
                    />
                  </div>

                  <div className="form_fields">
                    <label htmlFor="answer" className="form_label">
                      {" "}
                      Answer of the above question{" "}
                    </label>
                    <select
                      className="form-select"
                      name="eanswer"
                      value={ques.eanswer}
                      onChange={onChange}
                    >
                      <option value="1" defaultValue="option 1">
                        option 1
                      </option>
                      <option value="2">option 2</option>
                      <option value="3">option 3</option>
                      <option value="4">option 4</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={ques.equestion.length < 2}
                onClick={handleClick}
                type="button"
                className="btn btn-primary"
              >
                Update ques
              </button>
            </div>
          </div>
        </div>
      </div >
      <div className="qustion_wraps">
        <div className="qustion_page_title">
          <h2>Your Questions</h2>
        </div>
        <div className="container">
          {quess.length === 0 && "No notes to display"}
        </div>
        {quess.map((ques) => {
          return (
            <Quesitem
              ques={ques}
              key={ques._id}
              updateQues={updateQues}
              showAlert={props.showAlert}
            />
          );
        })}
        <div className="paeginations">
          <ul>
            {QueslengthList}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Questions;
