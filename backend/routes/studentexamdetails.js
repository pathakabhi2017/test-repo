const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const Exam = require("../models/UserResult");
const User = require("../models/User");
const Answer = require("../models/Result");

const moment = require("moment/moment");
const { mongoose } = require("mongoose");
const { body } = require("express-validator");

router.get("/stuexamdetails/:sid", async (req, res) => {

  try {

    const user = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.sid),
        }
      },
      {
        $lookup: {
          from: "user_results",
          localField: "_id",
          foreignField: "userId",
          as: "user_result",
        },
      },
    ])

    let goodArray = [];
    let no = 0;
    user.forEach((data, index) => {
      no++;
      const responseanswer = data.user_result.map((result, index) => {
        return {
          exam_name: result.examType,
          max_marks: result.max_marks,
          marks_Obtained: result.marks_Obtained,
          // total_questions: result.total_questions,
          // total_attempted: result.total_attempted,
          categoryResult: result.categoryResult,
          user_percentage: result.user_percentage + '%',
          result: result.result,
        }
      })

      goodArray.push({
        no: no,
        name: data.FirstName + " " + data.LastName,
        firstname: data.FirstName,
        lastname: data.LastName,
        phone: data.phone,
        email: data.email,
        responseanswer: responseanswer,
        date: moment(res.createdAt).format('DD-MM-YYYY'),
      })
    })
    res.status(200).send({
      success: true,
      result: goodArray,
    });
  } catch (error) {
    //console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
});


router.get("/stuexamdetailsdataview/:sid", async (req, res) => {

  try {

    const examsresultdata = await Exam.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.params.sid),
        }
      },

      {
        $project: {
          examType: 1, exam_name: 1, max_marks: 2, marks_Obtained: 1, user_percentage: 1, result: 1, answer_id: 1, createdAt: 1
        }
      }

    ])
    //console.log(examsresultdata)
    res.status(200).send({
      success: true,
      result: examsresultdata,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
});




router.get("/exportuseranswerdata/:aid", async (req, res) => {
  try {

    const ExamAnswerData = await Answer.findOne({ _id: req.params.aid })
    const ExamResultData = await Exam.findOne({ answer_id: req.params.aid }, {
      result: 1, _id: 0, marks_Obtained: 1, user_percentage: 1
    })



    const rowLen = ExamAnswerData.answer.length;

    const test = ExamAnswerData.answer.map((data, index) => {
      let index2 = index + 1;
      return {
        Question: data.question,
        Answer: data.options[data.answer - 1],
        User_answer: data.options[data.user_res - 1],
        Answer_result: (data.answer === data.user_res) ? 'Right' : 'Wrong',
        Score: (index2 === rowLen) ? ExamResultData._doc.marks_Obtained : '',
        Percentage: (index2 === rowLen) ? ExamResultData._doc.user_percentage : '',
        Result: (index2 === rowLen) ? ExamResultData._doc.result : '',
      }

    })
    res.status(200).send({
      success: true,
      result: test,
      name: ExamAnswerData.userId.name,
      exam_name: ExamAnswerData.examType,
      marksobtained: ExamResultData._doc.marks_Obtained,
      percentage: ExamResultData._doc.user_percentage,
      resultexam: ExamResultData._doc.result,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
});


module.exports = router;
