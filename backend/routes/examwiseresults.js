const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const UserResult = require("../models/UserResult");
const User = require("../models/User");
const moment = require("moment/moment");
const { mongoose } = require("mongoose");

// ROUTE 1 : Get All the Ques using : GET "/api/ques/getuser" .Login required
router.get("/fetchallresultwithexam", async (req, res) => {

  try {

    const getResults = await UserResult.aggregate([

      {

        $group: {

          _id: "$examTypeId",



          countPass: {

            $sum: {

              $cond: { if: { $eq: ["$result", "pass"] }, then: 1, else: 0 },

            },

          },

          countFail: {

            $sum: {

              $cond: { if: { $eq: ["$result", "fail"] }, then: 1, else: 0 },

            },

          },

          totalResuls: { $sum: 1 },

        },


      },
      {
        $sort: { _id: -1 }
      },
      {

        $lookup: {

          from: "exam_types",

          localField: "_id",

          foreignField: "_id",

          as: "data",

        },

      },


      { $unwind: "$data" },

      {

        $project: {

          countPass: 1,

          countFail: 1,

          totalResuls: 1,

          exam_name: "$data.exam_name",

        },

      },

    ]);

    // console.log(getResults);
    let no = 0;
    const data = getResults.map(item => {

      no++;
      return {
        no: no,
        id: item._id.toString(),
        name: item.exam_name,
        totalresult: item.totalResuls,
        countpass: item.countPass,
        countfail: item.countFail,
      }
    })

    res.status(200).send({
      success: true,
      data: data,
    });

  } catch (error) {
    //console.log(error.message);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
});

router.get("/fetchallexamtypesresults/:eid", async (req, res) => {

  try {
    //console.log(req.params.eid)
    const getResults = await UserResult.aggregate([

      {
        $match: {
          examTypeId: mongoose.Types.ObjectId(req.params.eid),
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: '$user' },
      {
        $addFields: {
          FirstName: '$user.FirstName',
          LastName: '$user.LastName',
          email: '$user.email',
          phone: '$user.phone'
        }
      },

      {

        $project: {
          FirstName: 1,
          LastName: 1,
          phone: 1,
          email: 1,
          max_marks: 1,
          marks_Obtained: 1,
          categoryResult: 1,
          user_percentage: 1,
          result: 1,
          examType: 1,
          exam_name: 1,
          createdAt: 1,

        }
      }

    ]);



    let no = 0;
    const exam_name = getResults ? getResults[0].exam_name : '';
    const data = getResults.map(item => {

      // console.log(_doc.createdAt)
      no++;
      return {
        no: no,
        id: item._id.toString(),
        name: item.FirstName + " " + item.LastName,
        //firstname: item.FirstName,
        //Lastname: item.LastName,
        phone: item.phone,
        email: item.email,
        max_marks: item.max_marks,
        score: item.marks_Obtained,
        categoryResult: item.categoryResult,
        percentage: item.user_percentage + '%',
        result: item.result,
        date: moment(item.createdAt).format('DD-MM-YYYY')
      }
    })


    res.status(200).send({
      success: true,
      data: data,
      examName: exam_name
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
