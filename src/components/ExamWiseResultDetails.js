import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState, useContext } from 'react';
import Highlighter from 'react-highlight-words';
import { Modal, Button, Input, Space, Table, Tag } from 'antd';
import resultwithexamdetail from '../context/examresults/ExamResultsContext';
import { useNavigate, useParams } from "react-router-dom";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ExamWiseResultDetails = () => {
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "Result Report"; // here enter filename for your excel file
    const contextexamresult = useContext(resultwithexamdetail);
    const { ExamResultsData, getexamwiseresultdetails, ExamName } = contextexamresult;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Modelcategorydata, setModelcategorydata] = useState({})
    const [dataInfo, setDataInfo] = useState({})
    let navigate = useNavigate();
    const params = useParams();
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

    const viewdatahandler = (data) => {

        setDataInfo(data)
        setIsModalOpen(true)
        setModelcategorydata(
            Object.entries(data.categoryResult)?.map(([key, value]) => (
                <>
                    <div className="cat_score">
                        <span><strong>{value.name} : </strong></span>
                        <span>{value.correctAnswer} / {value.attempted}</span>
                    </div>
                </>

            )))

    }

    const handleOk = () => {
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const exportToCSV = (apiData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(apiData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const columns = [
        {
            title: 'S.no',
            dataIndex: 'no',
            key: 'no',
            width: '10%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: '10%',
            ...getColumnSearchProps('phone'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '10%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            width: '10%',
            ...getColumnSearchProps('score'),
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            width: '10%',
            ...getColumnSearchProps('percentage'),
        },
        {
            title: 'Result',
            dataIndex: 'result',
            key: 'result',
            width: '10%',
            render: (result) => (

                <>

                    <span className={result == "fail" ? "fail" : "pass"} >

                        {result}

                    </span>

                </>

            ),
            filters: [
                {
                    text: 'Pass',
                    value: 'pass',
                },
                {
                    text: 'Fail',
                    value: 'fail',
                },

            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.result.startsWith(value),

        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '10%',

        },
        {
            title: 'Action',
            button: true,
            render: (data) => (<><Button classNames="btn" type="primary" onClick={() => viewdatahandler(data)} icon={<EyeOutlined />} size={'medium'} />
                {/* ,<Button type="primary" classNames="btn" icon={<DownloadOutlined />} size={'medium'} /> */}
            </>),
            width: '10%',
        },
    ];

    useEffect(() => {
        if (
            sessionStorage.getItem("token") === null ||
            sessionStorage.getItem("user-type") == "admin"
        ) {
            getexamwiseresultdetails(params.eid);
        } else {
            navigate("/");
        }

        // eslint-disable-next-line
    }, [params.eid]);

    return (
        <>
            <div className="all_page_title">
                <h2>&nbsp; {ExamName}</h2>
                <button className="btn btn-dark custom_float_right" onClick={(e) => exportToCSV(ExamResultsData, fileName)}>Export</button>
            </div>
            <Table columns={columns} dataSource={ExamResultsData} />
            <Modal className="EWresult" width={600} title=" " open={isModalOpen} footer={null} onOk={handleOk} okText="" cancelText="Close" onCancel={handleCancel}>
                <table id="currentuserinfopdf" style={{ width: "100%" }}>
                    <tr>
                        <td>
                            <div className="EWresult_data">
                                <h3>Student details</h3>
                                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tr>
                                        <td colspan="2"><strong>Name:</strong> {dataInfo.name}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email:</strong> {dataInfo.email}</td>
                                        <td><strong>Phone:</strong> {dataInfo.phone}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="EWresult_data">
                                <h3>Category Score</h3>
                                <div className="category_score">
                                    {Modelcategorydata}
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="EWresult_data">
                                <h3>Result Info</h3>
                                <table cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tr>
                                        <td><strong>Score:</strong> {dataInfo.score} / {dataInfo.max_marks}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Percentage:</strong> {dataInfo.percentage}</td>
                                        <td><strong>Result:</strong> <span className={dataInfo.result === 'pass' ? 'pass' : 'fail'}>{dataInfo.result}</span></td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </table >
            </Modal>
        </>
    )
}

export default ExamWiseResultDetails
