const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const moment = require("moment/moment");
const ExamType = require('../models/ExamType');
const Answers = require('../models/Result')
const slugify = require('slugify');
const multer = require('multer');
const upload = multer();
const mongoose = require('mongoose');

const { body, validationResult } = require("express-validator");

router.post("/add-exam", async (req, res) => {
  try {
    const slugvalue = slugify(req.body.b2, { replacement: '_', remove: undefined, strict: true, trim: true, lower: true })
    const examType = new ExamType({
      exam_name: req.body.b2,
      percentage: req.body.b4,
      exam_time: req.body.b5,
      exam_categories: req.body.b1,
      status: req.body.b3,
      image: req.body.b6,
      content: req.body.b7,
      passcode: req.body.b8,
      slug: slugvalue,
    });

    let ExamSlugData = await ExamType.findOne({ slug: slugvalue });
    let PassCodeData = await ExamType.findOne({ passcode: req.body.b8 })
    //console.log(examslug)
    if (PassCodeData) {
      res.json({ Error: "Oops! It seems that the Passcode you're trying to add already exists. Please provide a unique Passcode to continue." })
    }
    else
      if (ExamSlugData) {
        //res.status(404).send("Exam type allready exist");
        res.json({ Error: "Oops! It seems that the exam type you're trying to add already exists. Please provide a unique name to continue." });
      } else {
        const saveexamType = await examType.save();

        if (saveexamType._id) {
          res.json({ Success: "Exam type successfully added." });
          //res.json(savedQues);
        }
      }

  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});

function truncateString(str, num) {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, num) + ' ...'
}

router.get("/fetchallexamtype", async (req, res) => {
  try {
    //const result = await Exam.find();
    const result = await ExamType.aggregate([
      {

        $lookup: {
          from: "categories",
          localField: "exam_categories.category_id",
          foreignField: "_id",
          as: "data",
        }
      },

      {
        $lookup: {
          from: 'user_results',
          localField: "_id",
          foreignField: "examTypeId",
          as: "examdata",
        }
      },

      { $sort: { date: -1 } },
      {

        $addFields: {
          category_name: "$data.name",
          number_of_question: "$exam_categories.number_of_questions",
          category_id: "$exam_categories.category_id",
          examresultdata: "$examdata.result",

        },

      },

      { $project: { exam_name: 1, passcode: 1, percentage: 1, category_name: 1, number_of_question: 1, status: 1, category_id: 1, slug: 1, examresultdata: 1, exam_time: 1, date: 1, image: 1, content: 1 } }

    ]);



    let goodArray = [];
    let no = 0;
    result.forEach((exam, index) => {
      no++;
      //console.log(exam.category_name)
      const responseCategory = exam.category_name.map((item, index) => {
        return {
          category_name: item,
          category_id: exam.category_id[index],
          category_number: exam.number_of_question[index],

        }
      })


      goodArray.push({
        no: no,
        id: exam._id,
        name: exam.exam_name,
        passcode: exam.passcode,
        short_name: truncateString(exam.exam_name, 8),
        percentage: exam.percentage,
        exam_time: exam.exam_time,
        category: responseCategory,
        status: exam.status,
        image: exam.image,
        content: exam.content,
        slug: truncateString(exam.slug, 8),
        examresultdata: exam.examresultdata,
        link: 'https://assessment.inboundacademy.in?exam_type=' + Buffer.from(exam.slug).toString('base64'),
        date: moment(exam.date).format('DD-MM-YYYY'),
      })

    })
    //console.log(goodArray)
    res.json(goodArray);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4 : Delete an existing ques using : DELETE "/api/quess/deleteQues/:id" .Login required
router.delete("/deleteExam/:id", fetchuser, async (req, res) => {
  //Find the ques to be deleted and delete it
  try {
    let exam = await ExamType.findById(req.params.id);
    if (!exam) {
      res.status(404).send("Not Found");
    }

    exam = await ExamType.findByIdAndDelete(req.params.id);
    res.json({ Success: "exam has been deleted" });
  } catch (error) {
    //console.error(error.message);
    //res.status(500).send("Internal Server Error");
  }
});

router.post("/update-exam", upload.none(), async (req, res) => {
  try {
    let check = true;
    const formData = JSON.parse(JSON.stringify(req.body));
    const slugvalue = slugify(formData.exam_name, { replacement: '_', remove: undefined, strict: true, trim: true, lower: true })


    formData.exam_categories.map((item) => {
      item.category_id === '' ? check = false : '' ||
        item.number_of_questions === '' ? check = false : ''
    })

    const PassCodeValideString = /[ `!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?~]/;
    //console.log(formData)
    if (formData.exam_passcode.match(PassCodeValideString)) {

      res.status(400).send({
        status: 'error',
        message: "Passcode should be without special characters. Please use only letters, numbers and underscore."
      });
    }

    else
      if (formData.exam_name === '' || formData.exam_passcode === '' || formData.content === '' || formData.image === '' || formData.examtime === '' || formData.percentage === '' || formData.status === '' || check === false) {
        res.status(400).send({
          status: 'error',
          message: "Oops! Looks like you forgot something. Please fill out the all fields."
        });
        //return false;
      }

      else {

        const getExamId = await ExamType.findByIdAndUpdate(

          { _id: new mongoose.Types.ObjectId(formData.exam_id) },

          {
            exam_categories: formData.exam_categories,
            exam_name: formData.exam_name,
            passcode: formData.exam_passcode,
            status: formData.status,
            percentage: parseInt(formData.percentage),
            exam_time: parseInt(formData.exam_time),
            content: formData.content,
            image: formData.image,
            slug: slugvalue,
          },
          { new: true }
        );

        if (getExamId) {


          res.status(200).send({
            status: 'success',
            message: "Exam updated successfully."
          });



        } else {

          res

            .status(400)

            .send({
              status: 'error',
              message: "something went wrong"
            });

        }
      }
  }
  catch (error) {

    res.status(500).send("Internal Server Error");
  }

});

router.get("/getanswersbyexamid/:id", async (req, res) => {
  try {
    const answers = await Answers.find({ examTypeId: req.params.id }, { answer: 1 })
    const MainAnswers = await Answers.findOne({ examTypeId: req.params.id }, { answer: 1 })


    let FinalArray = [];

    const response = MainAnswers.answer.map((item) => {

      let R = 0;
      let W = 0;
      let Total = 0;
      answers.forEach((element) => {

        element.answer.forEach((item2) => {

          if (item._id == item2._id) {

            if (item2.answer === item2.user_res) {
              R++;

            }

            if (item2.answer != item2.user_res) {
              W++;

            }
            Total = R + W;
          }

        })

      });

      return {
        Question: item.question,
        RightAnswer: R,
        WrongAnswer: W,
        Total: Total
      }

    })



    return res.status(200).json({ response })


  }
  catch (error) {

  }

})


router.get("/cloneexamdata/:id", async (req, res) => {

  try {
    let Exam = await ExamType.findById(req.params.id, { _id: 0 });
    if (!Exam) {

      res.status(404).send({
        status: 'error',
        message: "The requested exam could not be found."
      });
    } else {
      const slugvalue = slugify(Exam.exam_name + '_Copy', { replacement: '_', remove: undefined, strict: true, trim: true, lower: true })
      const examType = new ExamType({
        exam_name: Exam.exam_name + '_Copy',
        passcode: Exam.passcode + '_Copy',
        percentage: Exam.percentage,
        exam_time: Exam.exam_time,
        exam_categories: Exam.exam_categories,
        status: Exam.status,
        image: Exam.image,
        content: Exam.content,
        slug: slugvalue,
      });
      let CopyExam = await examType.save()
      if (CopyExam) {
        res.status(200).send({
          status: 'success',
          message: "Exam cloned successfully."
        });
      }

    }

  }

  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router;