import React, { useEffect, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import catesContext from "../context/cats/CatesContext";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Button, Table, Input, Space, Select, Modal, Tag } from 'antd';


const CategoriesList = (props) => {
  let navigate = useNavigate();
  const context = useContext(catesContext);
  const [DataInfo, setDataInfo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { cates, getCates, editCates, addCates } = context;

  useEffect(() => {
    if (
      sessionStorage.getItem("token") === null ||
      sessionStorage.getItem("user-type") === "admin"
    ) {
      getCates();
    } else {
      navigate("/");
    }

    // eslint-disable-next-line
  }, []);

  const [catess, setCatess] = useState({
    id: "",
    name: "",
    status: "",
  });

  const editdatahandler = (data) => {
    setIsModalOpen(true);
    setDataInfo(data);
    setCatess(data);
  }


  // Delete a Note
  const deleteCates = async (id) => {
    // API Call
    const response = await fetch(`/api/categories/deleteCates/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    const json = await response.json();

    if (json.status === "success") {

      props.showAlert(json.data.message, "success");
    } else {
      props.showAlert(json.error.message, "danger");
    }
    getCates()
  };


  const deletecategoryhandeler = (data) => {

    if (window.confirm("Delete the item?")) {
      deleteCates(data.id);
      // console.log(DeleteCatesRes.status)


    }

  }

  const onChange = (e) => {

    setCatess({ ...catess, [e.target.name]: e.target.value }); //whatever value inside the ques object will exist as it is but jo properties aage likhi ja rhi hai inko add ya overwrite kar dena


  };

  const handleChange = (value) => {
    //console.log(`selected ${value}`);
    setCatess({ ...catess, status: value }); //whatever value inside the ques object will exist as it is but jo properties aage likhi ja rhi hai inko add ya overwrite kar dena

  };

  const handleOkEdit = () => {

    //console.log(catess);
    //return;
    if (catess.name === '' || catess.status === '') {
      props.showAlert('Oops! Looks like you forgot something. Please fill out the all fields.', 'danger');
      return false;
    }
    editCates(
      catess.id,
      catess.name,
      catess.status,
    ).then(function (data) {
      //console.log(data['response_msg'])

      if (data['response_msg'] === 'duplicate_data') {

        props.showAlert("Oops! It seems that the category you're trying to add already exists. Please provide a unique name to continue.", "danger");
      } else {
        setIsModalOpen(false);
        props.showAlert("Category updated successfully!", "success");
      }
    }

    );
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddModelOpen = () => {
    setIsAddModalOpen(true);
  }

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  }

  const handleOkAdd = () => {

    if (catess.name === '' || catess.status === '') {
      props.showAlert('Oops! Looks like you forgot something. Please fill out the required field.', 'danger');
      return false;
    }

    addCates(
      catess.name,
      catess.status,
    ).then(function (data) {
      //console.log(data['response_msg'])

      if (data['response_msg'] === 'duplicate_data') {

        props.showAlert("Oops! It seems that the category you're trying to add already exists. Please provide a unique name to continue.", "danger");
      } else {
        setIsAddModalOpen(false);
        props.showAlert("Category added successfully!", "success");
      }
    }

    );

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

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'Active',
          value: 'Active',
        },
        {
          text: 'Inactive',
          value: 'Inactive',
        },

      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => (<>


        <Tag color={status === 'Inactive' ? 'volcano' : 'green'} key={status}>
          {status.toUpperCase()}
        </Tag>
      </>
      )
    },
    {
      title: 'Date Created',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Action',
      button: true,
      render: (data) => (<><div div className="cus-button">
        &nbsp;<Button type="primary" ghost className="btn22 btn-primary" onClick={() => editdatahandler(data)} icon={<EditOutlined />} size={'medium'} />
        &nbsp;<Button danger type="primary" className="btn1" onClick={() => deletecategoryhandeler(data)} icon={<DeleteOutlined />} size={'medium'} />
      </div></>),
      width: '20%',
    },
  ];

  return (
    <>
      <div className="all_page_title">
        <h2>Categories</h2>
      </div>
      <div className="row">
        <div className="col-lg-9 col-md-5 col-sm-12">
          <Table columns={columns} dataSource={cates} />
          {/* Edit category model */}
          <Modal title="Edit Category" open={isModalOpen} onOk={handleOkEdit} okText="Submit" cancelText="Close" onCancel={handleCancel}>
            <div className="signup_form add_question_form popup_form">
              <div className="qs_form">
                <div className="form_fields" style={{ 'max-width': '100%' }}>
                  <label htmlFor="title" className="form_label">
                    {" "}
                    Name{" "}
                  </label>
                  <input
                    type="text"
                    key={DataInfo.name}
                    name="name"
                    onChange={onChange}
                    defaultValue={DataInfo.name}
                  />


                </div>

                <div className="form_fields" style={{ 'max-width': '100%' }}>
                  <label htmlFor="title" className="form_label">
                    {" "}
                    Status{" "}
                  </label>
                  <Select
                    defaultValue={DataInfo.status}
                    onChange={handleChange}
                    className="form_label"
                    name="status"
                    key="status"
                    style={{
                      width: 450,
                    }}
                    options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
                  />
                </div>

              </div>
            </div>
          </Modal>

          {/* Add category model */}

          <Modal title="Category Details" open={isAddModalOpen} onOk={handleOkAdd} okText="Submit" cancelText="Close" onCancel={handleAddCancel}>
            <div className="signup_form add_question_form popup_form">
              <div className="qs_form">
                <div className="form_fields" style={{ 'max-width': '100%' }}>
                  <label htmlFor="title" className="form_label">
                    {" "}
                    Name{" "}
                  </label>
                  <input
                    type="text"
                    key='name'
                    name="name"
                    onChange={onChange}
                    defaultValue=''
                  />


                </div>

                <div className="form_fields" style={{ 'max-width': '100%' }}>
                  <label htmlFor="title" className="form_label">
                    {" "}
                    Status{" "}
                  </label>
                  <Select
                    defaultValue=''
                    onChange={handleChange}
                    name="status"
                    className="form_label"
                    style={{
                      width: 450,
                    }}
                    key="status"
                    options={[{ value: '', label: '--Please choose an Status--' }, { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
                  />
                </div>

              </div>
            </div>
          </Modal>

        </div>
        <div className="col-lg-3 col-md-5 col-sm-12 s-l-space">
          <div className="login_sign_up_wraper3 all_page_sidebar">
            <div className="signup_form3">
              <div className="sidebar_title">
                <h5>Sidebar Section</h5>
              </div>
              <div className="form_fields">
                <button onClick={handleAddModelOpen} name="add_category" className="btn desktop_logout">
                  <i className="fa-solid fa-plus"></i>&nbsp; Add New
                </button>
              </div>

            </div></div >
        </div >
      </div >
    </>
  );
};
export default CategoriesList;