import React, { useEffect, useRef, useContext, useState, ChangeEvent } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button, Table, Tag, Input, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import resultContext from '../context/results/ResultsContext';

const ExamWiseResult_List = () => {
    let navigate = useNavigate();
    const context = useContext(resultContext);
    const { ExamResults, getexamwiseresult } = context;

    useEffect(() => {
        if (
            sessionStorage.getItem("token") === null ||
            sessionStorage.getItem("user-type") == "admin"
        ) {
            getexamwiseresult();
        } else {
            navigate("/");
        }

        // eslint-disable-next-line
    }, []);



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
            title: 'S,no',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'Exam name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Total test',
            dataIndex: 'totalresult',
            key: 'totalresult',
        },
        {
            title: 'Total pass',
            dataIndex: 'countpass',
            key: 'countpass',
            render: (countpass) => <Tag color='green'>{countpass}</Tag>,

        },
        {
            title: 'Total fail',
            key: 'countfail',
            dataIndex: 'countfail',
            render: (countfail) => <Tag color='geekblue'>{countfail}</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (data) => (<>
                <Link to={`/examwiseresultdetails/${data.id}`}><EyeOutlined className="btn custombtn_result_view" /></Link>
            </>),

        },
    ];

    return (
        <>
            <div className="all_page_title">
                <h2>Exam Wise Result</h2>
            </div>
            <Table columns={columns} dataSource={ExamResults} />
        </>
    )
}

export default ExamWiseResult_List
