import React, { useEffect, useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, SearchOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import userContext from "../context/users/UserContext";
import Highlighter from 'react-highlight-words';
import { Button, Space, Table, Input, Modal, DatePicker } from 'antd';
import axios from 'axios';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import * as moment from "moment";


const UsersList = (props) => {
    let navigate = useNavigate();
    const context = useContext(userContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { Users, getUsers, editUsers, deleteUser } = context;
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [DataInfoEdit, setDataInfoEdit] = useState('');
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const searchInput = useRef(null);
    const [Modeldata, setModeldata] = useState();
    const [isModalOpenResult, setIsModalOpenResult] = useState(false);
    const [ModeldataResult, setModeldataResult] = useState();
    const [ModeldataResultScore, setModeldataResultScore] = useState();
    const [ModeldataResultPercentage, setModeldataResultpercentage] = useState();
    const [ModeldataResultD, setModeldataResultD] = useState();
    const [ModeldataExamList, setModeldataExamList] = useState();
    const [isModalOpenExamList, setIsModalOpenExamList] = useState(false);


    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";


    useEffect(() => {
        if (
            sessionStorage.getItem("token") === null ||
            sessionStorage.getItem("user-type") === "admin"
        ) {
            getUsers();
        } else {
            navigate("/");
        }

        // eslint-disable-next-line
    }, []);

    const [userss, setUserss] = useState({
        id: "",
        name: "",
        status: "",
        email: "",
        phone: "",
    });

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

    const examsListHandler = (data) => {
        setModeldataExamList(Object.entries(data.exam_names)?.map(([key, value]) => (
            <>
                {<tr>
                    <td>{value.exam_name}</td>
                    <td><a href={data.user_link + 'exam_type=' + window.btoa(value.slug)}>Link</a></td>
                </tr >}
            </>
        )))
        setIsModalOpenExamList(true);
    }



    const columns = [
        {
            title: 'S.no',
            dataIndex: 'no',
            key: 'no',
            width: '2%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: '10%',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '10%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Exam Given',
            dataIndex: 'exam_total',
            key: 'exam_total',
            width: '5%',
        },

        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            width: '5%',
            ...getColumnSearchProps('location'),
        },
        {
            title: 'Center',
            dataIndex: 'center',
            key: 'center',
            width: '10%',
            ...getColumnSearchProps('center'),
        },
        // {
        //     title: 'User Link',
        //     dataIndex: 'user_link',
        //     key: 'user_link',
        //     render: (text) => <a href={text} rel="noreferrer" target="_blank">User link</a>,
        //     width: '8%',
        // },
        // {
        //     title: 'Exams Link',
        //     render: (data) =>
        //         // <a href="javascript:void(0)" onClick={() => viewdatahandler(data)}>Click</a>,
        //         <a href={() => false} onClick={() => examsListHandler(data)}> <EyeOutlined style={{ fontSize: '20px' }} /></a >,
        //     width: '8%',
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '5%',
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
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            ...getColumnSearchProps('date', 'date'),
        },
        {
            title: 'Action',
            button: true,
            render: (data) => (<><div div className="cus-button">
                <Button className="btn23" type="primary" onClick={() => viewdatahandler(data)} icon={<EyeOutlined />} size={'medium'} />
                &nbsp; <Button type="primary" ghost className="btn22 btn-primary" onClick={() => editdatahandler(data)} icon={<EditOutlined />} size={'medium'} />
                &nbsp; <Button danger type="primary" className="btn1" onClick={() => {
                    //console.log(data)
                    if (window.confirm("Delete the item?")) {
                        deleteUser(data.id);
                        props.showAlert("Deleted successfully", "success");
                    }
                }} icon={<DeleteOutlined />} size={'medium'} />
            </div ></>),
            width: '25%',
        }
    ]

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleOkResult = () => {
        setIsModalOpenResult(false);
    };
    const handleCancelResult = () => {
        setIsModalOpenResult(false);
    };
    const handleOkExamList = () => {
        setIsModalOpenExamList(false);
    };
    const handleCancelExamList = () => {
        setIsModalOpenExamList(false);
    };


    const exportToCSV = async (answer_id) => {

        const response = await axios.get(`/api/examdetails/exportuseranswerdata/${answer_id}`)

        const ws = XLSX.utils.json_to_sheet(response.data.result);
        const wb = { Sheets: { Result: ws }, SheetNames: ["Result"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, 'Result-' + response.data.exam_name + fileExtension);
    };



    const handleViewQuestions = async (answer_id) => {
        const Result = await axios.get(`/api/examdetails/exportuseranswerdata/${answer_id}`)
        setModeldataResultScore(Result.data.marksobtained);
        setModeldataResultpercentage(Result.data.percentage);
        setModeldataResultD(Result.data.resultexam);

        setModeldataResult(

            Object.entries(Result.data.result)?.map(([key, value]) => (
                <>
                    {<tr tr >
                        <td className="question">  {value.Question}</td>
                        <td className="answer">{value.Answer}</td>
                        <td className="user-answer">{value.User_answer}</td>
                        <td className="answer-result">{value.Answer_result}</td>
                    </tr >}

                </>
            )

            ))
        setIsModalOpenResult(true);
    }

    const viewdatahandler = async (data) => {

        const response = await axios.get(`/api/examdetails/stuexamdetailsdataview/${data.id}`)
        setModeldata(Object.entries(response.data.result)?.map(([key, value]) => (

            <>


                <tr>
                    <td>{value.exam_name}</td>
                    <td align="center">{value.max_marks}</td>
                    <td align="center">{value.marks_Obtained}</td>
                    <td align="center">{value.user_percentage}%</td>
                    <td className={value.result === 'pass' ? 'pass' : 'fail'}>{value.result}</td>

                    <td align="center">{moment(value.createdAt).format('DD-MM-YYYY')}</td>
                    <td align="center">

                        <Button className=" btn btn-dark custom_float_right " onClick={(e) => exportToCSV(value.answer_id)} icon={<DownloadOutlined />} style={{
                            marginRight: '10px',
                            marginLeft: '10px'
                        }} size={'medium'} />
                        <Button className="btn23 btn-dark custom_float_right " onClick={(e) => handleViewQuestions(value.answer_id)} icon={<EyeOutlined />} size={'medium'} />

                    </td>
                </tr >
            </>
        )))

        setIsModalOpen(true)



    }

    const editdatahandler = (data) => {
        // console.log(data)
        setDataInfoEdit(data);
        setIsModalOpenEdit(true);
        setUserss({
            ...userss,
            id: data.id,
            name: data.name,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            status: data.cStatus,
            location: data.location,
            center: data.center,
        });

    }


    const handleOkEdit = () => {

        editUsers(
            userss.id,
            userss.name,
            userss.firstname,
            userss.lastname,
            userss.email,
            userss.location,
            userss.center,
            userss.status,
        );



        setIsModalOpenEdit(false);
        props.showAlert("Updated Successfully", "success");
        //setIsModalOpenEdit(false);
    }

    const handleCancelEdit = () => {

        setIsModalOpenEdit(false);
        //setDataInfoEdit('Abhi');

    };

    const onChange = (e) => {
        setUserss({ ...userss, [e.target.name]: e.target.value }); //whatever value inside the ques object will exist as it is but jo properties aage likhi ja rhi hai inko add ya overwrite kar dena

    }

    const handleChange = (e) => {

        setUserss({ ...userss, status: e.target.value }); //whatever value inside the ques object will exist as it is but jo properties aage likhi ja rhi hai inko add ya overwrite kar dena

    };

    return (
        <>

            <div className="all_page_title">
                <h2>Student List</h2>

            </div>
            <Table columns={columns} dataSource={Users} />

            {/* Model edit */}

            <Modal title={"Edit user details"} open={isModalOpenEdit} onOk={handleOkEdit} cancelText="Cancel" okText="Submit" onCancel={handleCancelEdit} width={600}>
                <div className="signup_form add_question_form popup_form">
                    <div className="qs_form">

                        <div className="form_fields">
                            <label htmlFor="title" className="form_label">

                                First name
                            </label>

                            <input
                                type="text"

                                name="firstname"
                                defaultValue={DataInfoEdit.firstname}
                                onChange={onChange}
                                minLength={2}
                                key={DataInfoEdit.firstname}
                                required
                                placeholder="Enter the first name"
                            />


                        </div>
                        <div className="form_fields">
                            <label htmlFor="title" className="form_label">

                                last name
                            </label>

                            <input
                                type="text"

                                name="lastname"
                                defaultValue={DataInfoEdit.lastname}
                                onChange={onChange}
                                minLength={2}
                                key={DataInfoEdit.last}
                                required
                                placeholder="Enter the first name"
                            />


                        </div>
                        <div className="form_fields">
                            <label htmlFor="tag" className="form_label">

                                Phone
                            </label>
                            <input
                                type="text"
                                key={DataInfoEdit.phone}
                                name="phone"
                                defaultValue={DataInfoEdit.phone}
                                onChange={onChange}
                                disabled="true"
                                minLength={10}
                                required
                                placeholder="Enter the phone"
                            />
                        </div>
                        <div className="form_fields">
                            <label htmlFor="tag" className="form_label">

                                Email
                            </label>
                            <input
                                type="text"
                                key={DataInfoEdit.email}
                                name="email"
                                defaultValue={DataInfoEdit.email}
                                onChange={onChange}
                                minLength={5}
                                required
                                placeholder="Enter the email"
                            />
                        </div>

                        <div className="form_fields">
                            <label htmlFor="tag" className="form_label">

                                Location
                            </label>
                            <input
                                type="text"
                                key={DataInfoEdit.location}
                                name="location"
                                defaultValue={DataInfoEdit.location}
                                onChange={onChange}
                                minLength={5}
                                required
                                placeholder="Enter the location"
                            />
                        </div>

                        <div className="form_fields">
                            <label htmlFor="tag" className="form_label">
                                Center
                            </label>
                            <input
                                type="text"
                                key={DataInfoEdit.center}
                                name="center"
                                defaultValue={DataInfoEdit.center}
                                onChange={onChange}
                                minLength={5}
                                required
                                placeholder="Enter the center"
                            />
                        </div>


                        <div className="form_fields">
                            <label htmlFor="title" className="form_label">

                                Status
                            </label>

                            <select name="status" onChange={handleChange} >
                                <option value="">--Please choose an Status--</option>
                                <option selected={DataInfoEdit.cStatus === 1 ? true : false} value="1">Active</option>
                                <option selected={DataInfoEdit.cStatus === 0 ? true : false} value="0">Inactive</option>

                            </select>


                        </div>



                        <div className="form_fields">
                            <label htmlFor="User_id" className="form_label">

                                User id
                            </label>
                            <input
                                type="text"
                                key={DataInfoEdit.id}

                                defaultValue={DataInfoEdit.id}
                                disabled
                                required
                                placeholder="Enter the email"
                            />



                        </div>


                    </div>
                </div>
            </Modal >

            <Modal title="Exams deatils" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer="" width={750}>
                <table className="result_data_table" width="100%" cellPadding="0" cellSpacing="0">
                    <tr>
                        <th>Exam name</th>
                        <th>Max marks</th>
                        <th>Marks obtain</th>
                        <th>Percentage</th>
                        <th>Result</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                    {Modeldata}
                </table>

            </Modal>

            <Modal title="Questions report" open={isModalOpenResult} footer={''} onOk={handleOkResult} onCancel={handleCancelResult} width={1000}>
                <table className="questionreporttable">
                    <thead>
                        <tr>
                            <th className="question">Question</th>
                            <th className="answer">Answer</th>
                            <th className="user-answer">User Answer</th>
                            <th className="answer-result">Answer Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ModeldataResult}
                    </tbody>

                </table>
                <table className="ftable-new">
                    <tfoot className="tablefooter">
                        <tr><td height={20}></td></tr>
                        <tr>
                            <td className="scoretable">Score</td>
                            <td className="scoreresult">{ModeldataResultScore}</td>
                        </tr>
                        <tr>
                            <td className="scoretable">Percentage</td>
                            <td className="scoreresult">{ModeldataResultPercentage}</td>
                        </tr>
                        <tr>
                            <td className="scoretable">Result</td>
                            <td className="scoreresult">{ModeldataResultD}</td>
                        </tr>
                    </tfoot>
                </table>
            </Modal >

            <Modal title="Exam list" open={isModalOpenExamList} onOk={handleOkExamList} onCancel={handleCancelExamList} footer={''}>
                <table className="result_data_table" width="100%" cellpadding="0" cellspacing="0">

                    <thead>
                        <tr>
                            <th>Exam name</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ModeldataExamList}
                    </tbody>
                </table>
            </Modal>

        </>
    )
}

export default UsersList
