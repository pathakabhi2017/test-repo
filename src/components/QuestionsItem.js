import React, { useContext } from "react";
import quesContext from "../context/ques/QuesContext";

const QuestionsItem = (props) => {
  const context = useContext(quesContext);
  const { deleteQues } = context;
  const { ques, updateQues } = props;
  return (
    <div className="qustionitmes">
      <div className="card_qustionitmes">
        <div className="qustionitmes_card_body">
          <h5 className="card-title">{ques.question}</h5>
          <div className="qustionitmes_ans">
            <div className="row">
              <div className="col">
                <ol type="a" className="mcq_ans">
                  {ques.options.map((option, key) => {
                    return <li key={key}> {option}</li>;
                  })}
                </ol>
              </div>
            </div>
          </div>
          <div className="qustionitmes_ans_result">
            <div className="ans_cat_wp">
              <div className="ans_cat d-flex">
                <div className="curt_ans">
                  Answer is : <strong>{ques.answer}</strong>
                </div>
                <div className="curt_cat">
                  Category : <strong>{ques.category}</strong>
                </div>
              </div>
              <div className="action_qusetion_btns">
                <i
                  className="fa-solid fa-trash"
                  onClick={() => {
                    if (window.confirm("Delete the item?")) {
                      deleteQues(ques._id);
                      props.showAlert("deleted successfully", "success");
                    }
                  }}
                ></i>
                <i
                  className="fa-solid fa-file-pen"
                  onClick={() => {
                    updateQues(ques);
                  }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsItem;
