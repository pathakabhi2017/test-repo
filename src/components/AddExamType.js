import React from "react";
import ImageUploading from 'react-images-uploading';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { EditorState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from 'draft-convert';
import { Navigate } from "react-router-dom";

class AddExamType extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      formValues: [{ category_id: '', number_of_questions: "" }],
      exam: '',
      passcode: '',
      status: '',
      percentage: '',
      examtime: '',
      image: '',
      ContentView: EditorState.createEmpty(),
      content: '',
      categorieslist: [],
      ExamSubmit: "",

    };

    this.handleSubmit = this.handleSubmit.bind(this)

  }


  componentDidMount() {
    this.getCategoryData();

  }

  handleChange(i, e) {

    if (e.target.value > Number(e.target.max)) {
      this.props.showAlert('Please enter a value less than than or equal to ' + e.target.max + '', "danger")

    } else {
      let formValues = this.state.formValues;
      formValues[i][e.target.name] = e.target.value;
      this.setState({ formValues });
    }


  }



  handleChangeCats(i, e) {

    const isFound = this.state.formValues.some(element => {

      if (element.category_id === e.target.value) {
        return true;
      }
      return false

    });


    let MaxQuestion = e.target.options[e.target.selectedIndex].getAttribute('totalquestion');
    document.getElementById(i).setAttribute("max", MaxQuestion);
    //document.getElementById(i).setAttribute("value", " ");

    // console.log(MaxQuestion)


    if (isFound === true) {
      this.props.showAlert('You have selected this category in above list', "danger")
      e.target.value = '';
    }

    let formValues = this.state.formValues;
    formValues[i][e.target.name] = e.target.value;
    formValues[i]['number_of_questions'] = '';
    //console.log(formValues[i]['number_of_questions'])
    this.setState({ formValues });

  }

  handleChangeoption(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleChange2(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleChangeimage(imageList) {

    this.setState({ image: imageList[0]['data_url'] })

  }

  handleEditorChange(content) {
    this.setState({ ContentView: content });
    let check_content = convertToHTML(content.getCurrentContent());
    this.setState({ content: check_content });
  };

  addFormFields() {
    this.setState(({
      formValues: [...this.state.formValues, { category_id: "", number_of_questions: "" }]
    }))
  }

  removeFormFields(i) {
    let formValues = this.state.formValues;
    formValues.splice(i, 1);
    this.setState({ formValues });
  }

  getCategoryData = async (e) => {
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
    this.setState({ categorieslist: json.categories })

  }

  handleSubmit = async (event) => {

    event.preventDefault();
    let check = true;

    const PassCodeValideString = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
    if (this.state.passcode.match(PassCodeValideString)) {
      this.props.showAlert('Passcode should be without special characters. Please use only letters, numbers and underscore.', "danger")
    }

    {
      this.state.formValues.map((element) => (
        <>
          {element.category_id === '' ? check = false : '' ||
            element.number_of_questions === '' ? check = false : ''
          }
        </>
      )
      )
    }

    if (this.state.exam === '' || this.state.passcode === '' || this.state.content === '' || this.state.image === '' || this.state.examtime === '' || this.state.percentage === '' || this.state.status === '' || check === false) {
      this.props.showAlert('Oops! Looks like you forgot something. Please fill out the all fields.', "danger")
      return false;
    }


    const response = await fetch("/api/exam/add-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        b1: this.state.formValues,
        b2: this.state.exam,
        b3: this.state.status,
        b4: this.state.percentage,
        b5: this.state.examtime,
        b6: this.state.image,
        b7: this.state.content,
        b8: this.state.passcode,
      })

    });
    const json = await response.json();
    if (json.Success) {
      this.setState({ ExamSubmit: 'Done' });
      this.props.showAlert(json.Success, "success")

    } else if (json.Error) {
      this.props.showAlert(json.Error, "danger")
    }

    else {
      this.props.showAlert('Here is some blank fields in form please check', "danger")
    }



  };



  render() {
    return (

      <div className="qustion_wraps">
        <form onSubmit={this.handleSubmit}>
          <div className="all_page_title">
            <h2>Add New Exam</h2>
            {(this.state.ExamSubmit != "") ?
              < Navigate to="/exams-list" replace={true} /> : ""}

          </div>
          <div className="signup_form add_question_form">
            <div className="qs_form ">
              <div className="form_fields" style={{ 'max-width': '100%' }}>
                <label>Name</label>
                <input type="text" name="exam" onChange={e => this.handleChange2(e)} />
              </div>
              <div className="form_fields" style={{ 'max-width': '100%' }}>
                <label>Passcode</label>
                <input type="text" name="passcode" onChange={e => this.handleChange2(e)} />
              </div>
              <div className="form_fields" style={{ 'max-width': '100%' }}>
                <label>Instructions</label>
                <Editor
                  editorState={this.state.ContentView}
                  onEditorStateChange={e => this.handleEditorChange(e)}
                />
              </div>
              <div className="form_fields form_fields">
                <label htmlFor="title" className="form_label">
                  {" "}
                  Exam Time{" "}
                </label>
                <select name="examtime" onChange={e => this.handleChangeoption(e)} >
                  <option value="">--Please choose an exam time--</option>
                  <option value="10">10 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="40">40 minutes</option>
                  <option value="50">50 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="70">70 minutes</option>
                  <option value="80">80 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="100">100 minutes</option>
                  <option value="110">110 minutes</option>
                  <option value="120">120 minutes</option>
                  <option value="130">130 minutes</option>
                  <option value="140">140 minutes</option>
                  <option value="150">150 minutes</option>
                  <option value="160">160 minutes</option>
                  <option value="170">170 minutes</option>
                  <option value="180">180 minutes</option>
                </select>
              </div>
              <div className="form_fields form_fields">
                <label htmlFor="title" className="form_label">
                  {" "}
                  Passing percentage(%){" "}
                </label>
                <select name="percentage" onChange={e => this.handleChangeoption(e)} >
                  <option value="">--Please choose an Percentage--</option>
                  <option value="05">05%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="25">25%</option>
                  <option value="30">30%</option>
                  <option value="35">35%</option>
                  <option value="40">40%</option>
                  <option value="45">45%</option>
                  <option value="50">50%</option>
                  <option value="55">55%</option>
                  <option value="60">60%</option>
                  <option value="65">65%</option>
                  <option value="70">70%</option>
                  <option value="75">75%</option>
                  <option value="80">80%</option>
                  <option value="85">85%</option>
                  <option value="90">90%</option>
                  <option value="95">95%</option>
                  <option value="100">100%</option>
                </select>
              </div>
              {this.state.formValues.map((element, index) => (
                <div className="fields_add_remv" key={index}>
                  <div className="form_fields">
                    <label>Category</label>
                    <select id="category_id" name="category_id" onChange={e => this.handleChangeCats(index, e)}>
                      <option value="">--Please choose an category-- </option>
                      {
                        this.state.categorieslist.map(
                          (element) =>

                            <option totalquestion={element.questions_total} value={element.id} disabled={element.questions_total < 1 ? 'true' : ''}>{element.name} ({element.questions_total})</option>
                        )
                      }

                    </select>
                  </div>
                  <div className="form_fields" >
                    <label>Number of questions </label>
                    <input type="number" className="form-control" name="number_of_questions" id={index} value={element.number_of_questions || ""} min={1} onChange={e => this.handleChange(index, e)} />
                  </div>
                  <div className="form_fields">
                    <div className="form_fields_rmv_qus">
                      <label>&nbsp;</label>
                      {
                        index ?
                          <button type="button" className="add_remv_btn remve" onClick={() => this.removeFormFields(index)}><i className="fa-regular fa-square-minus"></i></button>
                          : null
                      }
                    </div>
                    <div className="form_fields_add_qus">
                      <label>&nbsp;</label>
                      <button className="add_remv_btn f_adds" type="button" onClick={() => this.addFormFields()}><i className="fa-regular fa-square-plus"></i></button>
                    </div>
                  </div>
                </div >
              ))
              }

              <div className="form_fields" >

                <label htmlFor="title" className="form_label">
                  Banner{" "}
                </label>
                <div className="App">
                  <ImageUploading
                    multiple
                    value={this.state.image}
                    onChange={e => this.handleChangeimage(e)}
                    maxNumber='2'
                    dataURLKey="data_url"
                    name='image'
                    acceptType={["jpg"]}
                  >
                    {({
                      onImageUpload,
                      onImageRemove,
                      isDragging,
                      dragProps
                    }) => (

                      <div className="upload__image-wrapper">
                        <span className="upload-section"
                          style={isDragging ? { color: "red" } : null}
                          onClick={onImageUpload}
                          {...dragProps}>
                          <UploadOutlined /><span className="choose-file">   Upload a File</span>
                        </span>
                        {this.state.image ? <><span className="imagewithclose">
                          <img src={this.state.image} alt="" width="100" /><a onClick={() => onImageRemove(0)}>< CloseOutlined style={{ fontSize: '30px', color: 'red' }} /></a>
                        </span>
                        </> : ''}
                      </div>
                    )}
                  </ImageUploading>
                </div>
              </div>
              <div className="form_fields">
                <label htmlFor="title" className="form_label">
                  Status
                </label>
                <select name="status" onChange={e => this.handleChangeoption(e)} >
                  <option value="">--Please choose an status--</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="form_fields">
              <button className="button submit " type="submit">Submit</button>
            </div>
          </div >
        </form >
      </div >
    );
  }
}
export default AddExamType;