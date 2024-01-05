import React, { useEffect, useRef, useContext, useState, Fragment } from "react";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { EyeOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined, CloseOutlined, CopyOutlined } from "@ant-design/icons";
import examContext from "../context/exam/ExamContext";
import ImageUploading from 'react-images-uploading';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToHTML } from 'draft-convert';
import htmlToDraft from 'html-to-draftjs';
import { Button, Table, Modal, Tag, Form, Popconfirm, Space, Input } from "antd";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
const ExamTypeList = (props) => {

	let navigate = useNavigate();
	const context = useContext(examContext);
	const [DataInfo, setDataInfo] = useState({});
	const [DataInfoEdit, setDataInfoEdit] = useState({});
	const [CategoriesList, setCategoriesList] = useState({});
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const [formValues, setformValues] = useState([{ category_id: '', number_of_questions: "" }])
	const { exams, getExams, deleteExam, clonedata, ExamCloneStatus } = context;
	const [inputFields, setInputFields] = useState([]);
	const [status, setStatus] = useState(DataInfo.status);
	const [Percentage, setPercentage] = useState(DataInfo.percentage);
	const [Image, setImage] = useState(DataInfo.image);
	const [Examtime, setExamtime] = useState(DataInfo.exam_time);
	const [Content, setContent] = useState();
	const [ContentView, setContentView] = useState(
		() => EditorState.createEmpty(),
	);
	const [ContentViewe, setContentViewe] = useState(
		() => EditorState.createEmpty(),
	);
	const [isModalOpenreport, setIsModalOpenReport] = useState(false);
	const [datatest, setdatatest] = useState();
	const [setexportId, setIsexportId] = useState();
	const percentageArr = [
		5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100
	];
	const fileType =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";
	useEffect(() => {
		if (
			sessionStorage.getItem("token") === null || sessionStorage.getItem("user-type") === "admin") {
			getExams();
			getCategoryData();

		} else {
			navigate("/");
		}

	}, []);

	const getCategoryData = async (e) => {
		const response = await fetch(
			"/api/categories/fetchallcategoriesactive",
			{
				method: "GET",
				headers: {
					"Cache-Control": "no-cache",
					"Content-Type": "application/json",
					"auth-token": sessionStorage.getItem("token"),
				},
			}
		);
		const json = await response.json();
		setCategoriesList(json.categories);
	};



	const editdatahandler = (data) => {
		setDataInfoEdit(data);
		setExamtime(data.exam_time)
		setPercentage(data.percentage)
		setInputFields(data.category);
		setImage(data.image);
		const htmlContent = data.content;
		const contentBlock = htmlToDraft(htmlContent);
		const contentState = ContentState.createFromBlockArray(
			contentBlock.contentBlocks
		);

		setContentView(EditorState.createWithContent(contentState));
		setIsEditModalOpen(true);

	};

	const viewdatahandler = (data) => {
		setDataInfo(data);

		const htmlContent = data.content;
		const contentBlock = htmlToDraft(htmlContent);
		const contentState = ContentState.createFromBlockArray(
			contentBlock.contentBlocks
		);
		setContentViewe(EditorState.createWithContent(contentState));
		setIsViewModalOpen(true);
	};


	const copydatahandler = async (data) => {
		//console.log(data.id)

		const response = await fetch(`/api/exam/cloneexamdata/${data.id}`, {
			method: "GET",
			headers: {
				"Cache-Control": "no-cache",
				"Content-Type": "application/json",
				"auth-token": sessionStorage.getItem("token"),
			},
		}
		);

		const json = await response.json();
		getExams();
		if (json.status = 'success') {

			props.showAlert(json.message, "success");
		} else {
			props.showAlert("Please try again", "danger");
		}
	}



	const deleteexamhandeler = (data) => {
		if (window.confirm("Delete the item?")) {
			deleteExam(data.id);
			props.showAlert("Deleted successfully", "success");
		}
	};

	const handleChange2 = (e) => {
	};

	const handleChangeImage = (imageList) => {
		setImage(imageList[0]['data_url'])

	}

	const handleEditorChange = (content) => {
		setContentView(content)
		let check_content = convertToHTML(content.getCurrentContent());
		setContent(check_content);
	};


	const handleChange = (i, e) => {



		if (e.target.value > Number(e.target.max)) {
			props.showAlert('Please enter a value less than than or equal to ' + e.target.max + '', "danger")

		} else {

			formValues[i][e.target.name] = e.target.value;
			setformValues({ formValues });
		}


	}



	const handleChangeCats = (i, e) => {

		const isFound = inputFields.some(element => {

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
			props.showAlert('You have selected this category in above list', "danger")
			e.target.value = '';
		}

		inputFields[i][e.target.name] = e.target.value;
		inputFields[i]['category_number'] = '';
		setInputFields(inputFields);

	}
	const handleOk = () => { };
	const handleCancel = () => {
		setIsViewModalOpen(false);
	};


	const handleOkEdit = async (e) => {
		e.preventDefault();
		const formdata = new FormData(document.getElementById("editExamId"));





		formdata.append('content', Content);
		formdata.append('image', Image);

		const response = await fetch("/api/exam/update-exam", {

			method: "post",
			body: formdata,

		});
		let data = await response.json()
		console.log(data)


		if (data.status === 'success') {
			props.showAlert(data.message, "success");
			setIsEditModalOpen(false);

			getExams();

		} else {
			props.showAlert(data.message, "danger");

		}




	};

	const handleCancelEdit = () => {

		setIsEditModalOpen(false);

	};



	const handleAddFields = () => {

		const values = [...inputFields];

		values.push({ firstName: "", lastName: "" });

		setInputFields(values);

	};

	const handleRemoveFields = (index) => {

		const values = [...inputFields];

		values.splice(index, 1);

		setInputFields(values);

	};

	const handleOkReport = () => {
		setIsModalOpenReport(false);
	};
	const handleCancelReport = () => {
		setIsModalOpenReport(false);
	};

	const showExamReportHandler = async (datar) => {
		setIsexportId(datar.id)


		const response = await axios.get(`/api/exam/getanswersbyexamid/${datar.id}`)
		setdatatest(response.data.response)
		setIsModalOpenReport(true)
	}

	const exportExamReportHandel = async (id) => {
		const response = await axios.get(`/api/exam/getanswersbyexamid/${id}`)

		const ws = XLSX.utils.json_to_sheet(response.data.response);
		const wb = { Sheets: { Result: ws }, SheetNames: ["Result"] };
		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, 'Test' + fileExtension);
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

			title: "S.No",
			dataIndex: "no",
			key: "no",
			width: "10%",

		},

		{
			title: "Name",
			dataIndex: "short_name",
			key: "name",
			width: "10%",
			...getColumnSearchProps('name'),
		},

		{
			title: "Slug",
			dataIndex: "slug",
			key: "slug",
			width: "10%",
		},

		{

			title: "Passing Percentage",
			dataIndex: "percentage",
			key: "percentage",
			width: "5%",
		},

		{

			title: "Status",
			dataIndex: "status",
			key: "status",
			width: "10%",
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
			render: (status) => (

				<>

					<Tag color={status === "Inactive" ? "volcano" : "green"} key={status}>

						{status.toUpperCase()}

					</Tag>

				</>

			),


		},

		// {

		//     title: "Link",
		//     dataIndex: "link",
		//     key: "link",
		//     width: "10%",
		//     render: (link) => <a href={link} target="_blank" rel="noreferrer">Exam link</a>,

		// },

		{

			title: "Date Created",

			dataIndex: "date",

			key: "date",
			width: "15%",

		},



		{

			title: "Exam Report",

			width: "10%",
			render: (data) => <a a href='javascript:void(0)' onClick={() => showExamReportHandler(data)} >View</a>,

		},

		{

			title: "Action",

			button: true,

			render: (data) => (

				<>

					<div div className="cus-button">

						&nbsp;

						<Button

							type="primary"

							ghost

							className="btn23"

							onClick={() => viewdatahandler(data)}

							icon={<EyeOutlined />}

							size={"medium"}

						/>

						&nbsp;
						{
							<Button
								type="primary"
								ghost
								className="btn22 btn-primary"
								onClick={() => editdatahandler(data)}
								icon={<EditOutlined />}
								size={"medium"}

							/>
							//data.examresultdata.length === 0 ?


							// <Button
							//     type="primary"
							//     ghost
							//     className="btn22 btn-primary"
							//     onClick={() => editdatahandler(data)}
							//     icon={<EditOutlined />}
							//     size={"medium"}

							// /> :

							// <Tooltip placement="topLeft" title='Edit Disabled - One Exam Already Submitted'>
							//     <Button

							//         type="primary"

							//         ghost
							//         disabled='true'
							//         className="btn22 btn-primary"

							//         onClick={() => editdatahandler(data)}

							//         icon={<EditOutlined />}

							//         size={"medium"}

							//     />
							// </Tooltip>

						}
						&nbsp;
						<Button

							type="primary"

							ghost

							className="btn23"

							onClick={() => copydatahandler(data)}

							icon={<CopyOutlined />}

							size={"medium"}

						/>

						&nbsp;

						<Button

							danger

							type="primary"

							className="btn1"

							onClick={() => deleteexamhandeler(data)}

							icon={<DeleteOutlined />}

							size={"medium"}

						/>

					</div>

				</>

			),

			width: "20%",

		},

	];



	return (

		<>
			<div className="row">

				<div className="col-lg-12">
					<div className="all_page_title">
						<h2>Exams List</h2>
						<Link className="btn btn-dark custom_float_right" to="/addexamtype">Add Exam</Link>
					</div>
					<Table columns={columns} dataSource={exams} />

					{/* View exam details */}

					<Modal

						title="Exam details"

						footer={null}

						open={isViewModalOpen}

						onOk={handleOk}

						cancelText="Close"

						onCancel={handleCancel}

						width={800}

					>

						<div className="signup_form add_question_form popup_form">

							<div className="qs_form">

								<div className="form_fields" style={{ 'max-width': '100%' }} >

									<label htmlFor="title" className="form_label">
										Name
									</label>

									<input type="text" key={DataInfo.name} name="name" value={DataInfo.name} disabled />

								</div>

								<div className="form_fields" style={{ 'max-width': '100%' }} >

									<label htmlFor="title" className="form_label">Passcode</label>

									<input type="text" key={DataInfo.passcode} name="name" value={DataInfo.passcode} disabled />

								</div>

								<div className="form_fields" style={{ 'max-width': '100%' }}>
									<label>Instructions :</label>


									<Editor
										editorState={ContentViewe}

									/>
								</div>

								<div className="form_fields form_fields">
									<label htmlFor="title" className="form_label">

										Exam time
									</label>
									<select disabled name="exam_time"  >
										<option value="">--Please choose an exam time--</option>
										<option value="10" selected={DataInfo.exam_time === 10 ? true : false}>10 minutes</option>
										<option value="20" selected={DataInfo.exam_time === 20 ? true : false}>20 minutes</option>
										<option value="35" selected={DataInfo.exam_time === 30 ? true : false}>30 minutes</option>
										<option value="40" selected={DataInfo.exam_time === 40 ? true : false}>40 minutes</option>
										<option value="50" selected={DataInfo.exam_time === 50 ? true : false}>50 minutes</option>
										<option value="60" selected={DataInfo.exam_time === 60 ? true : false}>60 minutes</option>
										<option value="70" selected={DataInfo.exam_time === 70 ? true : false}>70 minutes</option>
										<option value="80" selected={DataInfo.exam_time === 80 ? true : false}>80 minutes</option>
										<option value="90" selected={DataInfo.exam_time === 90 ? true : false}>90 minutes</option>
										<option value="100" selected={DataInfo.exam_time === 100 ? true : false}>100 minutes</option>
										<option value="110" selected={DataInfo.exam_time === 110 ? true : false}>110 minutes</option>
										<option value="120" selected={DataInfo.exam_time === 120 ? true : false}>120 minutes</option>
										<option value="130" selected={DataInfo.exam_time === 130 ? true : false}>130 minutes</option>
										<option value="140" selected={DataInfo.exam_time === 140 ? true : false}>140 minutes</option>
										<option value="150" selected={DataInfo.exam_time === 150 ? true : false}>150 minutes</option>
										<option value="160" selected={DataInfo.exam_time === 160 ? true : false}>160 minutes</option>
										<option value="170" selected={DataInfo.exam_time === 170 ? true : false}>170 minutes</option>
										<option value="180" selected={DataInfo.exam_time === 180 ? true : false}>180 minutes</option>
									</select>
								</div>


								<div className="form_fields form_fields">
									<label htmlFor="title" className="form_label">

										Passing percentage(%)
									</label>
									<select disabled name="percentage"  >
										<option value="">--Please choose an Percentage--</option>
										{percentageArr.map((item) => (
											<option
												selected={
													DataInfo.percentage === item ? true : false
												}
												value={item}
											>
												{item}%
											</option>
										))}
									</select>
								</div>




								{DataInfo?.category?.map((item) => (

									<>

										<div className="form_fields">

											<label htmlFor="catename" className="form_label">
												Category
											</label>

											<input

												type="text"

												key={item.category_name}

												name="cate_name"

												value={item.category_name}

												disabled

											/>

										</div>



										<div className="form_fields">

											<label htmlFor="catelength" className="form_label">

												number of questions

											</label>

											<input

												type="text"

												key={item.category_name}

												name="cate_name"

												value={item.category_number}

												disabled

											/>

										</div>

									</>

								))}

								<div className="form_fields" >

									<label htmlFor="title" className="form_label">
										Banner
									</label>

									{DataInfo.image ? <> <img src={DataInfo.image} alt="" width="100" /></> : ''}

								</div>
								<div className="form_fields" >

									<label htmlFor="status" className="form_label">

										Status

									</label>

									<select

										className="form-select"

										name="status"

										value={DataInfo.status}

										disabled

									>

										<option value="Active" defaultValue="Active">

											Active

										</option>

										<option value="Inactive">Inactive</option>

									</select>

								</div>
							</div>

						</div>

					</Modal>



					{/* Model edit */}



					<Modal

						title="Edit exam"

						open={isEditModalOpen}

						onOk={handleOkEdit}

						cancelText="Cancel"

						okText="Submit"

						onCancel={handleCancelEdit}

						width={800}

					>

						<Form method="post" action="" id="editExamId" >

							<div className="signup_form add_question_form popup_form">

								<div className="qs_form">

									<div className="form_fields" style={{ 'max-width': '100%' }}>

										<label htmlFor="title" className="form_label">
											Name
										</label>

										<input

											type="text"

											key={DataInfoEdit.name} name="exam_name" defaultValue={DataInfoEdit.name} onChange={handleChange2} />

										<input

											type="hidden"

											name="exam_id"

											defaultValue={DataInfoEdit.id}

										/>

									</div>

									<div className="form_fields" style={{ 'max-width': '100%' }}>

										<label htmlFor="title" className="form_label">
											Passcode
										</label>

										<input

											type="text"

											key={DataInfoEdit.passcode} name="exam_passcode" defaultValue={DataInfoEdit.passcode} onChange={handleChange2} />
									</div>



									<div className="form_fields" style={{ 'max-width': '100%' }}>
										<label>Instructions :</label>


										<Editor
											editorState={ContentView}
											defaultEditorState={DataInfoEdit.content}
											onEditorStateChange={(e) => handleEditorChange(e)}

										/>
									</div>

									<div className="form_fields form_fields">
										<label htmlFor="title" className="form_label">
											Exam time
										</label>
										<select name="exam_time" title={(DataInfoEdit.examresultdata != "") ? 'Edit Disabled - One Exam Already Submitted' : ''} disabled={(DataInfoEdit.examresultdata != "") ? true : false} defaultValue={Examtime}
											onChange={(e) => setExamtime(e.target.value)}>
											<option value=""> --Please choose an exam time--</option>
											<option value="10" selected={Examtime === 10 ? true : false}>10 minutes</option>
											<option value="20" selected={Examtime === 20 ? true : false}>20 minutes</option>
											<option value="30" selected={Examtime === 30 ? true : false}>30 minutes</option>
											<option value="40" selected={Examtime === 40 ? true : false}>40 minutes</option>
											<option value="50" selected={Examtime === 50 ? true : false}>50 minutes</option>
											<option value="60" selected={Examtime === 60 ? true : false}>60 minutes</option>
											<option value="70" selected={Examtime === 70 ? true : false}>70 minutes</option>
											<option value="80" selected={Examtime === 80 ? true : false}>80 minutes</option>
											<option value="90" selected={Examtime === 90 ? true : false}>90 minutes</option>
											<option value="100" selected={Examtime === 100 ? true : false}>100 minutes</option>
											<option value="110" selected={Examtime === 110 ? true : false}>110 minutes</option>
											<option value="120" selected={Examtime === 120 ? true : false}>120 minutes</option>
											<option value="130" selected={Examtime === 130 ? true : false}>130 minutes</option>
											<option value="140" selected={Examtime === 140 ? true : false}>140 minutes</option>
											<option value="150" selected={Examtime === 150 ? true : false}>150 minutes</option>
											<option value="160" selected={Examtime === 160 ? true : false}>160 minutes</option>
											<option value="170" selected={Examtime === 170 ? true : false}>170 minutes</option>
											<option value="180" selected={Examtime === 180 ? true : false}>180 minutes</option>


										</select>

									</div>


									<div className="form_fields form_fields">
										<label htmlFor="title" className="form_label">
											Passing percentage(%)
										</label>

										<select name="percentage" defaultValue={Percentage}
											onChange={(e) => setPercentage(e.target.value)} title={(DataInfoEdit.examresultdata != "") ? 'Edit Disabled - One Exam Already Submitted' : ''} disabled={(DataInfoEdit.examresultdata != "") ? true : false} >
											{percentageArr.map((item) => (
												<option value={item} selected={Percentage === item ? true : false}>{item}%</option>
											))}
										</select>


									</div>



									{

										<>

											{inputFields.map((inputField, index) => (

												<Fragment key={`${inputField}~${index}`}>

													<div className="form_fields">

														<div className="">

															<label htmlFor="category_name">Category</label>



															<select
																title={(DataInfoEdit.examresultdata != "") ? 'Edit Disabled - One Exam Already Submitted' : ''} disabled={(DataInfoEdit.examresultdata != "") ? true : false}
																id={inputField.category_id}

																name={`exam_categories[${index}][category_id]`}

																onChange={(e) => handleChangeCats(index, e)}

															>

																<option value="">

																	--Please choose an category--

																</option>

																{CategoriesList.map((element) => (

																	<option
																		totalquestion={element.questions_total}
																		value={element.id}

																		selected={

																			inputField.category_id === element.id

																				? true

																				: false

																		}

																	>

																		{element.name} ({element.questions_total})

																	</option>

																))}

															</select>

														</div>

													</div>

													<div className="form_fields edit_qus_ad_mn">

														<div className="fld">
															<label htmlFor="number_of_ques">
																Number of question
															</label>
															<input
																type="number"
																title={(DataInfoEdit.examresultdata != "") ? 'Edit Disabled - One Exam Already Submitted' : ''} disabled={(DataInfoEdit.examresultdata != "") ? true : false}
																className="form-control"
																id={index}
																name={`exam_categories[${index}][number_of_questions]`}
																defaultValue={inputField.category_number}
																onChange={(e) => handleChange(index, e)}
																min='1'
																max={inputField.category_number}
															/>
														</div>
														<div className="fld">
															<div className="fld_btns">
																<label>&nbsp;</label>
																<button

																	type="button"
																	disabled={index === 0}
																	onClick={() => handleRemoveFields(index)}
																><i className="fa-regular fa-square-minus"></i></button>
															</div>
															<div className="fld_btns">
																<label>&nbsp;</label>
																<button
																	className=""
																	type="button"
																	onClick={() => handleAddFields()}
																><i className="fa-regular fa-square-plus"></i></button>
															</div>
														</div>

													</div>

												</Fragment>

											))}

										</>

									}

									<div className="form_fields" >

										<label htmlFor="title" className="form_label">
											Banner
										</label>

										<div className="App">
											<ImageUploading
												multiple
												value={Image}
												onChange={handleChangeImage}
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
													// write your building UI
													<div className="upload__image-wrapper">

														<span className="upload-section"
															style={isDragging ? { color: "red" } : null}
															onClick={onImageUpload}
															{...dragProps}>
															<UploadOutlined /><span className="choose-file">   Upload a File</span>
														</span>
														{Image ? <><span className="imagewithclose">
															<img src={Image} alt="" width="100" /><a onClick={() => onImageRemove(0)}>< CloseOutlined style={{ fontSize: '30px', color: 'red' }} /></a>
														</span>
														</> : ''}

													</div>
												)}
											</ImageUploading>
										</div>

									</div>

									<div className="form_fields" >

										<label htmlFor="status" className="form_label">

											{" "}

											Status{" "}

										</label>

										<select

											className="form-select"

											name="status"

											value={status}

											onChange={(e) => setStatus(e.target.value)}

										>

											<option

												selected={

													DataInfoEdit.status === "Active" ? true : false

												}

												value="Active"

											>

												Active

											</option>


											<option

												selected={

													DataInfoEdit.status === "Inactive" ? true : false

												}

												value="Inactive"

											>

												Inactive

											</option>

										</select>

									</div>

									{/* <div className="form_fields">

<button type="submit" onClick={handleOkEdit}>

Submit

</button>

</div> */}

								</div>

							</div>

						</Form>

					</Modal>

					<Modal Modal title="Exam questions report" open={isModalOpenreport} footer='' onOk={handleOkReport} onCancel={handleCancelReport} width={1000} >


						<table className="result_data_table" width="100%" cellPadding="0" cellSpacing="0">
							<tr>
								<th>Questions</th>
								<th>Right Answer</th>
								<th>Wrong Answer</th>
								<th>Total</th>

							</tr>

							{

								datatest?.map((value, key) => {
									return <tr>
										<td >{key + 1}. &nbsp; {value.Question}</td>
										<td align="center">{value.RightAnswer}</td>
										<td align="center">{value.WrongAnswer}</td>
										<td align="center">{value.Total}</td>
									</tr >
								})
							}
						</table>
						<button className=" btn btn-dark " onClick={(e) => exportExamReportHandel(setexportId)} icon={<DownloadOutlined />} size={'medium'}>Export</button>


					</Modal>

				</div>


				{/* <div className="col-lg-3 col-md-5 col-sm-12 s-l-space">

                    <div class="login_sign_up_wraper3">

                        <div class="signup_form3">

                            <div className="form_fields">

                                <h5>Sidebar Section</h5>

                            </div>

                            <hr></hr>



                            <div className="form_fields d-flex justify-content-end">

                                

                            </div>

                        </div>

                    </div>

                </div> */}

			</div>

		</>

	);

};

export default ExamTypeList;