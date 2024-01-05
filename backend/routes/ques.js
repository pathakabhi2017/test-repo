const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const Ques = require("../models/Ques");
const Exam = require("../models/Result");
const UserExam = require("../models/UserResult");
const User = require("../models/User");
const multer = require('multer');
const csvtojson = require('csvtojson');
const path = require('path')
const { body, validationResult } = require("express-validator");
const moment = require("moment/moment");
const Categories = require("../models/Categories");
const { userInfo } = require("os");

// ROUTE 1 : Get All the Ques using : GET "/api/ques/getuser" .Login required
router.get("/fetchallques", async (req, res) => {

  try {

    let no = 0;

    const questions = await Ques.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category_name",
        },
      },
      { $sort: { date: -1 } },
      { $unwind: '$category_name' }, { $addFields: { category_name: '$category_name.name' } }

    ])
    const questiondata = questions.map((res) => {
      no++;
      return {
        no: no,
        id: res._id,
        title: res.question,
        options: res.options,
        option0: res.options[0],
        option1: res.options[1],
        option2: res.options[2],
        option3: res.options[3],
        category: res.category_name,
        show_ans: res.options[res.answer - 1],
        answer: res.answer,
        date: moment(res.date).format('DD-MM-YYYY'),
      }
    })

    questions: questiondata,

      res.status(200).send({
        success: true,
        questions: questiondata,
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
});

// ROUTE: Fetch all the JSON for ques collection
router.get("/fetchallquesnoauthentication/", async (req, res) => {
  try {
    // db.quesses.aggregate([{$sample:{size:2}}])
    const quess = await Ques.aggregate([{ $sample: { size: 3 } }]);
    res.json(quess);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2 : Add a new ques using : POST "/api/quess/addques" .Login required
router.post(
  "/addques",
  fetchuser,
  [
    body("question", "Enter the question properly").isLength({ min: 1 }),
    body("options", "option1 must atleast 1 characters").isLength({ min: 1 }),
    body("answer", "answer must atleast 1 characters").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const { question, options, answer, category } =
        req.body;

      // If there are errors, return bad req and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const ques = new Ques({
        question,
        options,
        answer,
        category,
      });
      const savedQues = await ques.save();

      // to send the saved ques in the response
      res.json(savedQues);
      console.log(req.user.id);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3 : Update an existing ques using : PUT "/api/ques/updateques/:id" .Login required
router.put("/updateques/:id", fetchuser, async (req, res) => {
  const { question, options, answer, category } =
    req.body;

  //Find the ques to be updated and update it
  try {
    var ques = await Ques.findById(req.params.id);

    if (!ques) {
      res.status(404).send("Not Found");
    }

    ques = await Ques.findByIdAndUpdate(
      req.params.id,
      // { $set: newQues },

      {
        question,
        options,
        answer,
        category,
      },
      { new: true }
    );
    res.json({ ques });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3 : Update an existing ques using : PUT "/api/ques/updateques/:id" .Login required
router.put("/updatecode/:id", fetchuser, async (req, res) => {
  const { code } = req.body;
  //Create a new ques object
  const newQues = {};
  if (code) {
    newQues.code = code;
  }

  const numberHAI = req.params.id;

  // console.log(req.params.id);
  //Find the ques to be updated and update it
  try {
    var ques = await Ques.find({ user: numberHAI });
    // console.log(ques);

    if (!ques) {
      res.status(404).send("Not Found");
    }
    // if (ques.user.toString() !== req.user.id) {
    //   return res.status(401).send("Not Allowed");
    // }

    ques = await Ques.updateMany(
      { user: numberHAI },
      { $set: newQues },
      { new: true }
    );
    res.json({ ques });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4 : Delete an existing ques using : DELETE "/api/quess/deleteQues/:id" .Login required
router.delete("/deleteQues/:id", fetchuser, async (req, res) => {
  //Find the ques to be deleted and delete it
  try {
    let ques = await Ques.findById(req.params.id);
    if (!ques) {
      res.status(404).send("Not Found");
    }

    ques = await Ques.findByIdAndDelete(req.params.id);
    res.json({ Success: "Ques has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 1 : Get All the Ques using : GET "/api/ques/getuser" .Login required
router.get("/fetchallresult", async (req, res) => {
  try {
    //const result = await Exam.find();
    let no = 0;
    const resultData = await UserExam.aggregate([

      {
        $group: {
          _id: '$userId',
          exam_name: { $addToSet: '$exam_name' }
          , max_marks: { $addToSet: '$max_marks' }
          , marks_Obtained: { $addToSet: '$marks_Obtained' }
          , user_percentage: { $addToSet: '$user_percentage' }
          , result: { $addToSet: '$result' }
        }

      },


      {

        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user_info",
        },
      },
      { $unwind: "$user_info" },
      { $sort: { 'user_info.FirstName': 1 } }


    ]);

    console.log(resultData)


    const resultArr = resultData.map((res) => {

      no++;
      return {
        no: no,
        user_id: res['user_info']._id,
        name: res['user_info'].FirstName + ' ' + res['user_info'].LastName,
        email: res['user_info'].email,
        phone: res['user_info'].phone,
        score: res.marks_Obtained[0],
        percentage: res.user_percentage[0],
        aptitude: '',
        communication: '',
        logic_based: '',
        maths: '',
        result: res.result,
        exam_id: res._id,
        date: moment(res['user_info'].createdAt).format('DD-MM-YYYY'),
      }

    })


    res.json(resultArr);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/getstudentresults", async (req, res) => {
  try {
    //const result = await Exam.find();
    let no = 0;
    const resultData = await UserExam.aggregate([

      // {
      //   $group: {
      //     _id: '$userId',
      //     exam_name: { $addToSet: '$exam_name' }
      //     , max_marks: { $addToSet: '$max_marks' }
      //     , marks_Obtained: { $addToSet: '$marks_Obtained' }
      //     , user_percentage: { $addToSet: '$user_percentage' }
      //     , result: { $addToSet: '$result' }
      //   }

      // },





      {

        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user_info",
        },
      },

      { $unwind: "$user_info" },

      {
        $project: {
          user_info: 1, max_marks: 1, marks_Obtained: 1, total_questions: 1, total_attempted: 1, categoryResult: 1,
          user_percentage: 1, result: 1, exam_name: 1, createdAt: 1
        }
      }



    ]);

    //console.log(resultData)


    const resultArr = resultData.map((res) => {

      no++;
      return {
        no: no,
        user_id: res['user_info']._id,
        name: res['user_info'].FirstName + " " + res['user_info'].LastName,
        email: res['user_info'].email,
        phone: res['user_info'].phone,
        exam_name: res.exam_name,
        result: res.result,
        max_marks: res.max_marks,
        marks_Obtained: res.marks_Obtained,
        user_percentage: res.user_percentage,
        exam_categories: res.categoryResult,
        date: moment(res.createdAt).format('DD-MM-YYYY'),
      }

    })


    res.json(resultArr);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

var uploads = multer({ storage: storage });

// // Upload excel file and import to mongodb
// router.post('/uploadExcelFile', uploads.single("uploadfile"), async (req, res) => {

//   let arrayToInsert = [];
//   let success = true;
//   const data = path.join(__dirname, '../public/uploads/');

//   csvtojson().fromFile(data + req.file.filename).then(source => {
//     //  Read Excel File to Json Data

//     // Fetching the all data from each row
//     source.forEach(async (i) => {
//       if (i.category.trim()) {
//         const CatId = await returncateid(i.category.trim())

//         var singleRow = {
//           question: i.question.trim(),
//           options: [
//             i.option1.trim(),
//             i.option2.trim(),
//             i.option3.trim(),
//             i.option4.trim(),
//           ],

//           answer: i.answer.trim(),
//           category: CatId,
//         }
//       };


//       Ques.insertMany(singleRow, (err, result) => {
//         if (result) {
//           success = true;
//           //res.json({ success, success });
//         } else {
//           success = true;
//           //res.json({ success, success });

//         }
//       });

//     })

//     res.json({ success, success });


//   });

// });



// const returncateid = async (CatName) => {

//   //console.log(CatName) 
//   //console.log(CatName, typeof CatName);
//   const CategoryData = await Categories.findOne({ name: CatName });

//   if (CategoryData) {
//     //console.log(CategoryData)
//     return (CategoryData._id)
//   }

// }



router.post('/uploadExcelFile', uploads.single("uploadfile"), async (req, res) => {
  const data = path.join(__dirname, '../public/uploads/');
  const result = await csvtojson().fromFile(data + req.file.filename);
  const insertedData = await getCategoryData(result)


  if (insertedData === result.length) {

    return res.status(200).json({ success: true })
  }
  else {

    return res.status(400).json({ success: false })
  }
});
async function getCategoryData(source) {

  let promises = source.map(async (res) => {

    try {

      let obj = res;
      const categoryInfo = await Categories.findOne({ name: res.category })

      obj['category'] = categoryInfo._id,


        obj['options'] = [res.option1, res.option2]
      if (res.option3) {
        obj['options'].push(res.option3)
      }
      if (res.option4) {
        obj['options'].push(res.option4)
      }
      if (res.option5) {
        obj['options'].push(res.option5)
      }
      if (res.option6) {
        obj['options'].push(res.option6)
      }
      if (res.option7) {
        obj['options'].push(res.option7)
      }
      if (res.option8) {
        obj['options'].push(res.option8)
      }
      return obj;

    } catch (error) {
      return false

    }



  })

  let response = await Promise.all(promises);
  const insertData = response.filter((item) => {
    return item != false
  })

  if (insertData.length >= 1) {
    console.log(insertData)
    const insertedData = await Ques.insertMany(insertData);
    if (insertedData) {
      return insertData.length;
    }
  }

}



module.exports = router;
