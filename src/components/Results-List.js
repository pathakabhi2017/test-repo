import React, { useEffect, useRef, useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import quesContext from "../context/ques/QuesContext";
import Highlighter from 'react-highlight-words';
import jsPDF from "jspdf";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Button, Table, Modal, Input, Space, DatePicker } from 'antd';
//import { icons } from "antd/es/image/PreviewGroup";

const ResultList = ({ apiData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataInfo, setDataInfo] = useState({})
  //let cls = 'fail';
  //const ref = useRef(null);
  //const refClose = useRef(null);
  const context = useContext(quesContext);
  const { result, getResult, StudentResults, getStudentResults } = context;
  let navigate = useNavigate();
  // const showModal = () => {
  //   setIsModalOpen(true);
  // }
  const handleOk = () => {
    const report = new jsPDF('portrait', 'pt', 'a4');
    report.html(document.querySelector('#currentuserinfopdf')).then(() => {
      report.save('report.pdf');
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (
      sessionStorage.getItem("token") != null || sessionStorage.getItem("user-type") === "admin"
    ) {
      getResult();
      //getStudentResults();
    } else {
      navigate("/admin-login");
    }

  }, []);

  const viewdatahandler = (data) => {
    setDataInfo(data)
    setIsModalOpen(true)
  }

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
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



  const getColumnSearchProps = (dataIndex, filter_type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >

        {(filter_type === 'date') ?
          <DatePicker
            format={"DD-MM-YYYY"}
            onChange={(e) => {
              setSelectedKeys([e.format("DD-MM-YYYY")]);
            }}

            allowClear={false}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          :
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
        }

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
            Close
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
      width: '5%',
    },
    {
      title: 'Name',
      dataIndex: 'name',

      ...getColumnSearchProps('name'),
      width: '10%',
    },
    {
      title: 'Email',
      dataIndex: 'email',

      ...getColumnSearchProps('email'),

      width: '20%',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      ...getColumnSearchProps('phone'),
      width: '15%',
    },
    // {
    //   title: 'Score',
    //   dataIndex: 'score',
    //   sorter: (a, b) => a.score - b.score,
    //   width: '6%',
    // },
    // {
    //   title: 'Percentage',
    //   dataIndex: 'percentage',
    //   width: '5%',

    // }, {
    //   title: 'Result',
    //   dataIndex: 'result',


    //   filters: [
    //     {
    //       text: 'Pass',
    //       value: 'Pass',
    //     },
    //     {
    //       text: 'Fail',
    //       value: 'Fail',
    //     },

    //   ],
    //   filterMode: 'tree',
    //   filterSearch: true,
    //   onFilter: (value, record) => record.result.startsWith(value),
    //   width: '5%',


    //   render: (result) => (<>


    //     <Tag color={result == 'fail' ? 'volcano' : 'green'} key={result}>
    //       {result.toString().toUpperCase()}
    //     </Tag>
    //   </>
    //   )
    //   // render: (data) => (

    //   //   <span className={data === 'Pass' ? 'pass' : 'fail'}>
    //   //     {data}

    //   //   </span>
    //   // ),
    // },
    {
      title: 'Date',
      dataIndex: 'date',
      width: '10%',
      ...getColumnSearchProps('date', 'date'),
    },

    {
      title: 'Action',
      button: true,
      render: (data) => (<>

        <Link to={`/studentdetails/${data.user_id}`}><EyeOutlined className="btn custombtn_result_view" /></Link>

      </>),
      width: '10%',
    },
  ];


  return (
    <>
      <div className="all_page_title">
        <h2>Student Result List</h2>
        <button className="btn btn-dark custom_float_right" onClick={(e) => exportToCSV(apiData, fileName)}>Export</button>
      </div>
      <Table columns={columns} dataSource={result} />
      <Modal width={600} title=" " open={isModalOpen} footer={null} onOk={handleOk} okText="Generate pdf" cancelText="Close" onCancel={handleCancel}>
        <table id="currentuserinfopdf" style={{ width: "100%" }}>

          <tr>
            <td colspan="4"> <strong>Student Details</strong></td>
          </tr>
          <tr>
            <td><strong>User Id : </strong></td>
            <td>{dataInfo.user_id}</td>

            <td><strong>Name : </strong></td>
            <td>{dataInfo.name}</td>
          </tr>

          <tr>
            <td><strong>Email : </strong></td>
            <td>{dataInfo.email}</td>

            <td><strong>Phone : </strong></td>
            <td>{dataInfo.phone}</td>
          </tr>
          <tr>
            <td colspan="4"><hr /></td>
          </tr>

          <tr>
            <td colspan="4"> <strong>Category Score</strong></td>
          </tr>

          <tr>
            <td><strong>Aptitude : </strong></td>
            <td>{dataInfo.aptitude} / 5</td>

            <td><strong> Communication : </strong></td>
            <td>{dataInfo.communication} / 5</td>
          </tr>

          <tr>
            <td><strong>Logic Based : </strong></td>
            <td>{dataInfo.logic_based} / 5</td>
            <td><strong>Maths : </strong></td>
            <td>{dataInfo.maths} / 5</td>

          </tr>

          <tr>
            <td colspan="4"><hr /></td>
          </tr>

          <tr>
            <td colspan="4"> <strong>Result Info</strong></td>
          </tr>


          <tr>
            <td><strong>Score : </strong></td>
            <td>{dataInfo.score} / 20</td>

            <td><strong> Percentage : </strong></td>
            <td>{dataInfo.percentage}%</td>
          </tr>

          <tr>
            <td><strong>Result : </strong></td>
            <td className={dataInfo.result === 'Pass' ? 'pass' : 'fail'}>{dataInfo.result}</td>


          </tr>
        </table>
      </Modal>
    </>
  )
}
export default ResultList;