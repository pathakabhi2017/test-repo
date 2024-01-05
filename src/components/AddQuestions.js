import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import quesContext from "../context/ques/QuesContext";
import { EditorState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from 'draft-convert';

const AddQuestions = (props) => {
  const context = useContext(quesContext);
  const { addQues, editCode } = context;
  const [category, setCategory] = useState("Aptitude");
  const [Answer, setAnswer] = useState();
  const [CategoriesList, setCategoriesList] = useState([]);
  const [QuestionTitle, setQuestionTitle] = useState(EditorState.createEmpty())
  let navigate = useNavigate();
  const [ques, setQues] = useState({
    id: "",
    question: "",
    options: "",
    answer: Answer,
    category: category,
  });
  const handleClick = (e) => {
    e.preventDefault(); //page doesn't get reload

    if (ques.question === '' || ques.options.length <= 1 || ques.options[0] === '' || ques.options[1] === '' || Answer === '' || category === '') {
      props.showAlert('Oops! Looks like you forgot something. Please fill out the all fields.', 'danger');
      return false;
    }

    addQues(
      ques.question,
      ques.options,
      Answer,
      category
    );
    setQues({
      question: "",
      options: "",
      answer: Answer,
      category: category,
    });
    props.showAlert("Added Successfully", "success");
    navigate("/home");
  };

  useEffect(() => {
    if (
      sessionStorage.getItem("token") === null || sessionStorage.getItem("user-type") != "admin"
    ) {
      navigate("/login");
    } else {
      getCategoryData();
    }
  }, []);


  const getCategoryData = async (e) => {
    const response = await fetch("/api/categories/fetchallcategoriesactive", {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    }
    );
    const json = await response.json();
    setCategoriesList(json.categories)
  }


  const onChange = (e) => {
    setQues({ ...ques, [e.target.name]: e.target.value }); //whatever value inside the ques object will exist as it is but jo properties aage likhi ja rhi hai inko add ya overwrite kar dena
  };

  // const handleEditorChange = (content) => {

  //   // this.setState({ ContentView: content });
  //   setQuestionTitle(content)
  //   let check_content = convertToHTML(content.getCurrentContent());
  //   setQues({ ...ques, question: check_content });
  //   //this.setState({ content: check_content });
  // };

  const [formFields, setFormFields] = useState([
    { option: '' }, { option: '' }
  ])

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index] = event.target.value;
    setQues({ ...ques, options: data });
    setFormFields(data);
  }

  const addFields = () => {
    let object = ''
    setFormFields([...formFields, object])
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }
  return (
    <div>


      <div className="qustion_wraps">
        <div className="qustion_page_title">
          <h2>Add Your Questions</h2>
        </div>
        <div className="signup_form add_question_form">
          <div className="qs_form">
            <div className="form_fields" style={{ 'max-width': '100%' }}>
              <label htmlFor="title" className="form_label">

                Question
              </label>

              {/* <Editor
                editorState={QuestionTitle}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={handleEditorChange}
              />; */}
              <input
                type="text"
                id="question"
                name="question"
                onChange={onChange}
                value={ques.question}
                minLength={5}
                required
                placeholder="write your Question here"
              />
            </div>

            {formFields.map((form, index) => {

              return (
                <div className="form_fields" id={index}>
                  <div key={index}>
                    <input
                      name='options'
                      placeholder={'Option ' + (index + 1)}
                      onChange={event => handleFormChange(event, index)}
                      value={form.option}
                    />

                    {index >= 2 ? <button onClick={() => removeFields(index)} className="add_remv_btn remve"><i i className="fa-regular fa-square-minus"></i></button> : ''}&nbsp;
                    &nbsp;
                    {index >= 1 ?
                      <button className="add_remv_btn f_adds" onClick={addFields}><i className="fa-regular fa-square-plus"></i></button> : ''}

                  </div>
                </div>
              )

            })}

            <div className="form_fields">
              <label htmlFor="title" className="form_label">
                Answer of the above question
              </label>
              <select
                name="answer"
                value={Answer}
                onChange={(e) => setAnswer(e.target.value)}
              >

                {formFields.map((form, index) => {
                  console.log(form)
                  return (
                    <> <option disabled={form ? '' : true} value={index + 1} defaultValue="1">
                      Option {index + 1}</option></>
                  )
                })}

              </select>
            </div>

            <div className="form_fields">
              <label htmlFor="title" className="form_label">
                Question category
              </label>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {
                  CategoriesList?.map(
                    (element) =>

                      <option value={element.id}>{element.name}</option>
                  )
                }
              </select>
            </div>
            <div className="form_fields"></div>

            <div className="form_fields d-flex justify-content-end custom-submit">
              <button
                // disabled={
                //   ques.question.length < 1 ||
                //   ques.option1.length < 1 ||
                //   ques.option2.length < 1 ||
                //   ques.option3.length < 1 ||
                //   ques.option4.length < 1 ||
                //   ques.answer.length < 1
                // }
                type="submit"
                className="btn btn-dark"
                onClick={handleClick}
              >
                Add Question
              </button>

              <Link className="btn btn-dark custom-add-cancel"

                to="/home"
              >
                Cancel
              </Link>
            </div>


          </div>
        </div>
      </div >
    </div >
  );
};

export default AddQuestions;
