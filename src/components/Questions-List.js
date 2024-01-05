import React, { useEffect, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, EyeOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import quesContext from "../context/ques/QuesContext";
import CatesContext from "../context/cats/CatesContext";
import Highlighter from 'react-highlight-words';
import { Button, Space, Table, Input, Modal } from 'antd';

const QuestionsList = (props) => {

  let navigate = useNavigate();
  const context = useContext(quesContext);
  const Contextcategories = useContext(CatesContext);
  const { quess, getQuess, editQuess } = context;
  const { ActiveCates, getActiveCates } = Contextcategories;
  const { deleteQues } = context;
  const [DataInfo, setDataInfo] = useState({});
  const [DataInfoEdit, setDataInfoEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [editquesndata, seteditquesndata] = useState({
    title: '', options: '', answer: ''
  });

  const [formFields, setFormFields] = useState()

  // const [importfilename, setimportfilename] = useState('');
  useEffect(() => {
    if (
      sessionStorage.getItem("token") === null ||
      sessionStorage.getItem("user-type") === "admin"
    ) {
      getQuess();
      getActiveCates();

    } else {
      navigate("/");
    }

    // eslint-disable-next-line
  }, []);


  const onChange = (e) => {
    seteditquesndata({ ...editquesndata, [e.target.name]: e.target.value })
  }


  const handleOk = () => {
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const handleOkEdit = () => {
    if (editquesndata.question === '' || editquesndata.options.length <= 1 || editquesndata.options[0] === '' || editquesndata.options[1] === '' || editquesndata.answer === '') {
      props.showAlert('Oops! Looks like you forgot something. Please fill out the all fields.', 'danger');
      return false;
    }

    editQuess(
      editquesndata.id,
      editquesndata.title,
      editquesndata.options,
      editquesndata.answer
    );
    setIsModalOpenEdit(false);
    props.showAlert("Updated Successfully", "success");

  }

  const handleCancelEdit = () => {

    setIsModalOpenEdit(false);
    //setDataInfoEdit('Abhi');

  };

  const viewdatahandler = (data) => {
    setDataInfo(data)
    setIsModalOpen(true);
  }

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const form = useRef(null)
  const submit = async (e) => {
    e.preventDefault()
    const data = new FormData(form.current)

    const response = await fetch('/api/ques/uploadExcelFile',
      {
        method: 'POST',
        // headers: {
        //   "Cache-Control": "no-cache",
        // },
        body: data
      })
    const json = await response.json();
    //console.log(json)
    if (json.success === true) {

      props.showAlert("Data imported successfully. ", "success");
      getQuess();
    } else {
      getQuess();
      props.showAlert("There are some issue please check your data.", "danger");
    }
  }

  const editdatahandler = (data) => {
    setDataInfoEdit(data);
    setFormFields(data.options)
    seteditquesndata(data);
    setIsModalOpenEdit(true);

  }

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index] = event.target.value;
    setFormFields(data);
    seteditquesndata({ ...editquesndata, options: data });

  }


  const addFields = () => {
    let object = ''

    setFormFields([...formFields, object])

  }

  const removeFields = (index) => {

    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
    seteditquesndata({ ...editquesndata, options: data });
  }

  let CategoryArray = ActiveCates.map(function (val, index) {
    return { text: val['name'], value: val['name'] };
  })


  const columns = [
    {
      title: 'S.no',
      dataIndex: 'no',
      key: 'no',
      width: '5%',

    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',

      ...getColumnSearchProps('title'),

    },
    {
      title: 'Answer',
      dataIndex: 'show_ans',
      key: 'show_ans',
      width: '10%',

    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '10%',
      //...getColumnSearchProps('category'),
      filters: CategoryArray,

      onFilter: (value, record) => record.category.indexOf(value) === 0,

    },
    {
      title: 'Created Date',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
    },
    {
      title: 'Action',
      button: true,
      render: (data) => (<><div div className="cus-button"><Button className="btn23" type="primary" onClick={() => viewdatahandler(data)} icon={<EyeOutlined />} size={'medium'} />
        &nbsp;<Button type="primary" ghost className="btn22 btn-primary" onClick={() => editdatahandler(data)} icon={<EditOutlined />} size={'medium'} />
        &nbsp;<Button danger type="primary" className="btn1" onClick={() => {
          if (window.confirm("Delete the item?")) {
            deleteQues(data.id);
            props.showAlert("Deleted successfully", "success");
          }
        }} icon={<DeleteOutlined />} size={'medium'} />
      </div></>),
      width: '20%',
    },
  ];

  return (

    <>

      <div className="all_page_title"><h2>Questions</h2></div>
      <div className="row">
        <div className="col-lg-9 col-md-5 col-sm-12">
          <Table columns={columns} dataSource={quess} />
          <Modal title="Question details" footer={null} open={isModalOpen} onOk={handleOk} cancelText="Close" onCancel={handleCancel} width={1000}>
            <div className="signup_form add_question_form popup_form">
              <div className="qs_form">
                <div className="form_fields" style={{ 'max-width': '100%' }}>
                  <label htmlFor="title" className="form_label">

                    Question
                  </label>
                  <input
                    type="text"
                    id="equestion"
                    name="equestion"
                    value={DataInfo.title}
                    disabled

                  />
                </div>

                {DataInfo.options?.map((option, index) => {
                  return (<><div className="form_fields">
                    <label htmlFor="tag" className="form_label">

                      Option {index + 1}
                    </label>
                    <input
                      type="text"
                      id={'option' + index}
                      name={'option' + index}
                      value={option}

                      disabled
                    />
                  </div></>)

                })}

                <div className="form_fields">
                  <label htmlFor="answer" className="form_label">
                    Answer of the above question
                  </label>
                  <select
                    className="form-select"
                    name="eanswer"
                    value={DataInfo.answer}
                    disabled
                  >
                    {DataInfo.options?.map((option, index) => {
                      return (<><option option value={index + 1
                      }> option {index + 1}</option></>)

                    })}

                  </select>
                </div>
              </div>
            </div>
          </Modal>

          {/* Model edit */}

          <Modal title=" Edit Question details" open={isModalOpenEdit} onOk={handleOkEdit} cancelText="Cancel" okText="Submit" onCancel={handleCancelEdit} width={1000}>
            <div className="signup_form add_question_form popup_form">
              <div className="qs_form">
                <div className="form_fields" style={{ 'max-width': '100%' }}>
                  <label htmlFor="title" className="form_label">
                    Question
                  </label>

                  <input
                    type="text"

                    name="title"
                    defaultValue={DataInfoEdit.title}
                    onChange={onChange}
                    minLength={2}
                    key={DataInfoEdit.title}
                    required
                    placeholder="Enter the question"
                  />


                </div>


                {formFields?.map((option, index) => {

                  return (<>
                    <div className="form_fields" id={index}>
                      <div key={index}>
                        <label htmlFor="tag" className="form_label">

                          Option {index + 1}
                        </label>
                        <input
                          type="text"
                          key={'option' + index}
                          name={'option' + index}
                          defaultValue={option}
                          onChange={event => handleFormChange(event, index)}
                          minLength={2}
                          required
                        />
                        {index >= 2 ? <button onClick={() => removeFields(index)} className="add_remv_btn remve"><i i className="fa-regular fa-square-minus"></i></button> : ''}&nbsp;
                        &nbsp;
                        {index >= 1 ?
                          <button className="add_remv_btn f_adds" onClick={addFields}><i className="fa-regular fa-square-plus"></i></button> : ''}
                      </div>
                    </div>

                  </>)

                })}

                <div className="form_fields">
                  <label htmlFor="answer" className="form_label">
                    Answer of the above question
                  </label>
                  <select
                    className="form-select"
                    name="answer"
                    key={DataInfoEdit.answer}
                    defaultValue={DataInfoEdit.answer}
                    onChange={onChange}
                  >
                    {formFields?.map((data, index) => {

                      return (<><option disabled={data ? '' : true} value={index + 1
                      }> option {index + 1}</option></>)

                    })}
                  </select>
                </div>
              </div>
            </div>
          </Modal >
        </div >
        <div className="col-lg-3 col-md-5 col-sm-12 s-l-space">
          <div className="login_sign_up_wraper3 all_page_sidebar">
            <div className="signup_form3">
              <div className="sidebar_title"><h5>Sidebar Section</h5></div>
              <form ref={form} onSubmit={submit}>
                <div className="form_fields">
                  <input type="file" name="uploadfile" className="custom_form_file_type" accept='.csv' />
                </div>
                <div className="form_fields d-flex justify-content-end">
                  <input type="submit" name="Import" className="btn desktop_logout" value="Import" />
                </div>
              </form>
            </div></div>
        </div >
      </div >
    </>
  );
};
export default QuestionsList;