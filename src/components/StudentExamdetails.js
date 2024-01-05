import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EyeOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Tag } from 'antd';
import examContext from "../context/exam/ExamContext";


const StudentExamdetails = () => {
    const params = useParams();
    const [value, setValue] = useState("");
    const [Modeldata, setModeldata] = useState();
    const context = useContext(examContext);
    const { StudentResult, getStudentresult, StudentName, StudentEmail, StudentPhone } = context;
    const [isModalOpen, setIsModalOpen] = useState(false);
    let navigate = useNavigate();



    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const viewdatahandler = (data) => {

        setModeldata(
            Object.entries(data.categoryResult)?.map(([key, value]) => (
                <>
                    <tr>
                        <td>{value.name}</td>
                        <td align="center">{value.attempted}</td>
                        <td align="center">{value.correctAnswer}</td>
                    </tr>
                </>
            )))

        setIsModalOpen(true)


    }



    const columns = [
        {
            title: 'Exam Name',
            dataIndex: 'exam_name',
            sortDirections: ['descend'],
        },
        {
            title: 'Max marks',
            dataIndex: 'max_marks',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Marks obtain',
            dataIndex: 'marks_Obtained',

        },

        {
            title: 'Percentage',
            dataIndex: 'user_percentage',

        },

        {
            title: 'Result',
            dataIndex: 'result',
            render: (result) => (<>
                <Tag className={result} color={result === 'fail' ? 'volcano' : 'green'} key={result}>
                    {result}
                </Tag>
            </>
            )
        },

        {
            title: 'Action',
            button: true,
            render: (data) => (<>

                <Button classNames="btn" type="primary" onClick={() => viewdatahandler(data)} icon={<EyeOutlined />} size={'medium'} />

            </>),
            width: '10%',
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {

    };

    useEffect(() => {
        if (
            sessionStorage.getItem("token") === null ||
            sessionStorage.getItem("user-type") === "admin"
        ) {

            getStudentresult(params.sid);



        } else {
            navigate("/login");
        }

        // eslint-disable-next-line
    }, []);
    return (
        <>
            <div className="all_page_title cnt_info_title">
                <div className="title_details"><strong>Name:</strong> {StudentName}</div>
                <div className="title_details"><strong>Email:</strong> {StudentEmail}</div>
                <div className="title_details"><strong>Phone:</strong> {StudentPhone}</div>
            </div>
            <div className="row">  <br></br> <br></br><br></br> <Table columns={columns} dataSource={StudentResult} onChange={onChange} /></div>

            <Modal title="Result view" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <table className="result_data_table" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <th>Category Name</th>
                        <th align="center">Total Marks</th>
                        <th align="center">Marks Obtain</th>
                    </tr>
                    {Modeldata}
                </table>
            </Modal >


        </>
    );
}

export default StudentExamdetails;


