// export default ShowResult;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import Spinner from "./Spinner";

const ExamList = () => {
const [AllExams, setAllExams] = useState({});
const [DoneExams, setDoneExams] = useState({});
const [PendingExams, setPendingExams] = useState({});
const [isLoading, setIsLoading] = useState(true);
const search = useLocation().search;
const userId = new URLSearchParams(search).get("userId");
const [auth, setAuth] = useAuth();
const navigate = useNavigate();
let examsdata = ''

const startExamHandler = (slug) => {

setAuth({ ...auth, type: slug })
navigate('/home')
}
useEffect(() => {
	if(userId){
		const getUserScore = async () => {
			try {
			const { data } = await axios.post(
			"/api/v2/getallexamslist",
			{
			userId: userId,
			}
			);
			
			console.log(data)
			
			if (data) {
			
			setAllExams(data.examsall);
			setDoneExams(data.doneexams);
			setPendingExams(data.PendingExamslist);
			setIsLoading(false);
			
			}
			} catch (error) {
			console.log(error.message);
			window.location.href = "https://www.inboundacademy.in/";
			}
			};
			getUserScore();
	}else{

		navigate('/loginWithPhone')
	}

}, []);

function isInArray(array, search) {
let value = false;

array.forEach((a, i) => {
console.log(search)
console.log(Object.values(a)[0])
if (Object.values(a)[0] == search) {

value = true;
} else {
value = false;
}
}

)


return value;
}


function DoneisInArray(array, search) {
let value = false;

array.forEach((a, i) => {

if (Object.values(a)[0] == search) {

value = true;
} else {
value = false;
}
}

)


return value;
}
return (
<>
{isLoading ? (
<Spinner />
) : (
<div class="content_wraper">
<div class="logo">
<div class="container">
<a target="_blank" href="https://www.inboundacademy.in/">
<img src="images/inbound-academy-logo.webp" alt="Logo" />
</a>
</div>
</div>
<div class="body_content result_page">
<div class="container">
<div class="exam_start">
<div class="exam_result_gh">
<div class="exam_result_header">
<div class="exam_name_title">
<strong>Exam list</strong>
</div>

<div class="exam_tag_line text-center">
<div class="qustions_result_table">
<table width="100%" border="0" cellSpacing="0">
<thead>
<tr>
{/* <th>Sr No.</th> */}
<th>Name</th>
<th>Status</th>
<th>Action</th>

</tr>
</thead>
<tbody>

{examsdata = AllExams.map(function (value, index) {
return (
<>

<tr>

<td className="cat-blog">{value.exam_name}</td>
<td className="txtAlnCtr">
{(DoneisInArray(DoneExams, value._id) == true) ? <p className="levelcomplete">Complete</p> : ''}
{(isInArray(PendingExams, value._id) == true) ? <p className="levelincomplete">Incomplete</p> : ''}

{(DoneisInArray(DoneExams, value._id) == false && isInArray(PendingExams, value._id) == false) ? <p className="levelpending">Pending</p> : ''}

</td>
<td className="txtAlnCtr">


{(DoneisInArray(DoneExams, value._id) == false && isInArray(PendingExams, value._id) == false) ?
<button disabled={PendingExams.length > 0 ? true : false} className="btn btn-secondary btn-sm" onClick={() => startExamHandler(value.slug)} style={{ backgroundColor: '#003eff', color: '#ffffff', border: "none" }}>Start</button>


: ``}


{(isInArray(PendingExams, value._id) == true) ?

<button className="btn btn-secondary btn-sm" onClick={() => startExamHandler(value.slug)} style={{ backgroundColor: '#17a2b8', color: '#ffffff', border: 'none', padding: "8px 11px",  }}>Resume</button>: ''}</td>
</tr>

</>)
})

}


</tbody>

</table>
</div>
</div>
</div>

</div>
</div>
</div>
</div>
<footer class="text-center">
<div class="container">
Copyright © 2023.{" "}
<a href="https://www.transfunnel.com/" target="_blank">
TransFunnel Consulting
</a>
</div>
</footer>
</div>
)}


</>
);
};

export default ExamList;
