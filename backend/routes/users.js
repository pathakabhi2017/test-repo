const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ExamType = require("../models/ExamType");
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchUser');
const moment = require("moment/moment");


router.get("/fetchallusers", fetchuser, async (req, res) => {
  try {
    let no = 0;
    const Exams = await ExamType.find({ status: 'Active' }, { slug: 1, exam_name: 1 });


    const user = await User.aggregate([
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'userId',
          as: 'exams'
        }
      }, { $sort: { createdAt: -1 } },

    ])



    const Result = user.map(item => {
      no++;
      return {
        no: no,
        id: item._id,
        user_link: `https://assessment.inboundacademy.in/?id= ${Buffer.from(item._id).toString('base64')}`,
        name: item.FirstName + " " + item.LastName,
        firstname: item.FirstName,
        lastname: item.LastName,
        status: item.status == 1 ? 'Active' : 'Inactive',
        cStatus: item.status,
        exam_total: Object.keys(item.exams).length,
        exam_names: Exams,
        phone: item.phone,
        location: item.location,
        center: item.center,
        email: item.email,
        user_id: item._id,
        date: moment(item.createdAt).format('DD-MM-YYYY')
      }
    })



    res.status(200).send({
      success: true,
      users: Result,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
});


// ROUTE 3 : Update an existing ques using : PUT "/api/ques/updateques/:id" .Login required
router.put("/updateuser/:id", fetchuser, async (req, res) => {

  const { firstname, lastname, email, status, location, center } = req.body;
  const numberHAI = req.params.id;

  try {


    const updateUser = await User.findByIdAndUpdate({ _id: req.params.id }, {
      email: email,
      //name: name,
      FirstName: firstname,
      LastName: lastname,
      location: location,
      center: center,
      status: status
    })
    //console.log(updateUser)
    if (updateUser) {
      return res.status(200).json({ success: true, message: "User updated successfully" })
    }
    else {
      return res.status(200).json({ success: false, message: "User not found" })
    }

    // var user = await User.find({ user: numberHAI });
    // // console.log(ques);

    // if (!user) {
    //   res.status(404).send("Not Found");
    // }

    // user = await User.updateMany(
    //   { user: numberHAI },
    //   { $set: newUser },
    //   { new: true }
    // );
    // res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4 : Delete an existing user using : DELETE "/api/user/deleteUser/:id"
router.delete("/deleteUser/:id", fetchuser, async (req, res) => {
  //Find the ques to be deleted and delete it
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send("Not Found");
    }

    user = await User.findByIdAndDelete(req.params.id);
    res.json({ Success: "User has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});




module.exports = router;
