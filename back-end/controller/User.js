import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Msg91 from 'msg91';
import { default as AnswerModel } from "../models/answer.js";
import UserResponseModel from '../models/answer_response.js';
import CategoryModel from "../models/categories.js";
import ExamTypeModel from "../models/exam_type.js";
import UserModel from "../models/user.js";
import UserResultModel from "../models/user_result.js";
const msg91 = Msg91.default;
msg91.initialize({ authKey: "406891AwlqCKCKkUG65155bcaP1" });

class User {
  //register the user
  static register = async (req, res) => {
    try {
      const { name, email, phone, otp } = req.body;
      function capitalizeFirstLetter(name) {
        return name.replace(/\b\w/g, function (char) {
          return char.toUpperCase();
        });
      }
      let updatedName = capitalizeFirstLetter(name);

      let d = new Date();
      d.setDate(d.getDate() - 7);
      const number = phone.split("");

      if (number.length < 10 || number.length > 10) {
        return res.status(200).json({ success: false, message: "Invalid phone number" });
      }

      const isExistUser = await UserModel.findOne({ phone: phone });

      if (isExistUser) {
        const updateStatus = await UserModel.findOneAndUpdate(
          { _id: isExistUser._id },
          { otp: otp, verifyStatus: false }
        );
        return res
          .status(200)
          .json({ success: false, message: "Phone is already exist", userId: isExistUser._id });
      }

      const user = new UserModel({
        name: updatedName,
        email: email,
        phone: phone,
        otp: otp,
      });

      const crearedUser = await user.save();

      return res.status(200).json({ success: true, userId: crearedUser._id });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  //login user

  static login = async (req, res) => {
    const { otp, phone } = req.body;
    // const { exam_type } = req.query;
    if (!otp) {
      return res.status(200).json({ success: false, message: "otp is required" });
    }
    //  else if (!id) {
    //   return res
    //     .status(200)
    //     .json({ success: false, message: "user Id is required" });
    // } 
    else {
      const getUserInfo = await UserModel.findOne({
        $and: [{ phone: phone }, { otp: otp }],
      });
      if (!getUserInfo) {
        return res.status(200).json({ success: false, message: "Invalid OTP" });
      }
      // const checkExistResult = await UserResultModel.findOne({
      //   $and: [
      //     { userId: new mongoose.Types.ObjectId(id) },
      //     { examType: exam_type },
      //   ],
      // });

      // if (checkExistResult) {
      //   return res.status(200).json({
      //     success: false,
      //     message: "You Already Attempted this test!",
      //   });
      // }
      if (getUserInfo) {
        const token = jwt.sign({ _id: getUserInfo._id }, "secret", {
          expiresIn: "1h",
        });
        // if (token) {
        //   const updateStatus = await UserModel.findOneAndUpdate(
        //     { _id: id },
        //     { verifyStatus: true }
        //   );
        // }
        return res

          .status(200)

          .json({
            success: true,
            message: "login successfully",
            token: token,
            userInfo: getUserInfo,
          });
      } else {
        return res.status(400).json({
          success: false,
          message: "user is does not exists please register",
        });
      }
    }
  };

  //Login for exists users
  static loginExistUser = async (req, res) => {
    try {
      const { id, exam_type } = req.query;

      if (!id) {
        return res
          .status(200)
          .json({ success: false, message: "user Id is required" });
      }
      else {
        // const checkExistResult = await UserResultModel.findOne({
        //   $and: [
        //     { userId: new mongoose.Types.ObjectId(id) },
        //     { examType: exam_type },
        //   ],
        // });

        // if (checkExistResult) {
        //   return res.status(200).json({
        //     success: false,
        //     message: "You Already Attempted this test!",
        //   });
        // }
        const getUserInfo = await UserModel.findOne({ _id: id });
        if (!getUserInfo) {
          return res
            .status(200)
            .json({ success: false, message: "User does not exists!" });
        }
        if (getUserInfo.status === 0) {
          return res
            .status(200)
            .json({ success: false, message: "You blocked By Admin!" });
        }
        if (getUserInfo) {
          const token = jwt.sign({ _id: getUserInfo._id }, "secret", {
            expiresIn: "1h",
          });
          return res

            .status(200)

            .json({
              success: true,
              message: "login successfully",
              token: token,
              userInfo: getUserInfo,
            });
        } else {
          return res.status(400).json({
            success: false,
            message: "user is does not exists please register",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  //user results info
  static insertUserAnswerInfo = async (req, res) => {
    try {
      const { userId, userAnswer, exam_name } = req.body;
      const id = new mongoose.Types.ObjectId(userId);
      const checkExistAnswer = await AnswerModel.findOne({
        $and: [{ userId: id }, { examType: exam_name }],
      });
      const fetchExamTypeId = await ExamTypeModel.findOne({ slug: exam_name });

      if (fetchExamTypeId) {
        //check exists reponse
        if (checkExistAnswer) {
          return res.status(200).json({
            success: false,
            msg: "Exam submitted already",
          });
        }
        //save data in database
        const createAnswer = new AnswerModel({
          userId: id,
          answer: userAnswer,
          examType: exam_name,
          examTypeId: fetchExamTypeId._id,
          exam_name: fetchExamTypeId.exam_name
        });
        const createdAnswer = await createAnswer.save();

        if (createdAnswer) {
          const resp = await UserResponseModel.findOneAndDelete({ userId: userId })

          return res.status(200).json({
            success: true,
            msg: "user answer saved successfully",
            data: createdAnswer,
          });
        }
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  //calculate user scores
  static calculateUserScore = async (req, res) => {
    //! please don't touch this code
    try {
      const userId = new mongoose.Types.ObjectId(req.body.userId);
      const examType = req.body.exam_name;
      const answerId = req.body.answer_id;
      const getUserData = await AnswerModel.aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ]);
      // console.log(getUserData)
      const getExamType = await ExamTypeModel.findOne({ slug: examType });
      const userResp = getUserData[0].answer;

      const eachQuestionMarks = 1;
      const total_question_count = userResp.length;
      let correctAnswerCount = 0;
      let total_attempted = 0;
      let categoryResult = {};
      userResp.map((item) => {
        if (typeof categoryResult[item.category] === "undefined") {
          categoryResult[item.category] = {};
          if (
            typeof categoryResult[item.category]["attempted"] === "undefined" &&
            typeof categoryResult[item.category]["correctAnswer"] === "undefined"
          ) {
            categoryResult[item.category]["attempted"] = 0;
            categoryResult[item.category]["correctAnswer"] = 0;
          }
        }

        if (item.answer === item.user_res) {
          categoryResult[item.category]["correctAnswer"] =
            categoryResult[item.category]["correctAnswer"] + 1;
          correctAnswerCount++;
        }
        if (item.user_res) {
          categoryResult[item.category]["attempted"] =
            categoryResult[item.category]["attempted"] + 1;
          total_attempted++;
        }
      });
      const getCategory = await CategoryModel.find({});
      Object.entries(categoryResult).map(async ([key, value]) => {
        getCategory.forEach((item) => {
          if (item._id == key) {
            categoryResult[item._id]["name"] = item.name;
          }
        });
      });
      const marks_Obtained = correctAnswerCount * eachQuestionMarks;
      const requiredNumber = Math.ceil(
        total_question_count * (getExamType.percentage / 100)
      );

      let pass_fail = "";
      if (marks_Obtained >= requiredNumber) {
        pass_fail = "pass";
      } else {
        pass_fail = "fail";
      }
      //❓

      //save user  data in database
      const storeUserScore = new UserResultModel({
        userId: userId,
        max_marks: total_question_count * eachQuestionMarks,
        marks_Obtained: marks_Obtained,
        total_questions: total_question_count,
        total_attempted: total_attempted,
        categoryResult: categoryResult,
        user_percentage: (
          (correctAnswerCount / total_question_count) *
          100
        ).toFixed(2),
        result: pass_fail,

        examType: examType,
        examTypeId: getExamType._id,
        answer_id: answerId,
        exam_name: getExamType.exam_name
      });
      const storedUser = await storeUserScore.save();
      //send response
      if (storedUser) {
        return res.status(200).json({
          status: true,
          max_marks: total_question_count * eachQuestionMarks,
          marks_Obtained: marks_Obtained,
          total_questions: total_question_count,
          total_attempted: total_attempted,
          categoryResult: categoryResult,
          user_percentage: (
            (correctAnswerCount / total_question_count) *
            100
          ).toFixed(2),
          result: pass_fail,
          passing_marks: requiredNumber,
          requiredPercentage: getExamType.percentage,

        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  //resend otp
  static resendOtp = async (req, res) => {
    try {
      const { id, phoneNumber } = req.body;
      let sms = msg91.getSMS();

      if (!phoneNumber) {
        return res.status(200).json({ sucess: false, msg: "Phone Number is Required!" })
      }

      const getUserInfo = await UserModel.findOne({ phone: phoneNumber });

      if (getUserInfo) {
        const otp = Math.floor(100000 + Math.random() * 900000);


        const response = await sms.send("651bb085d6fc0568d06e53e2", { 'mobile': `91${phoneNumber}`, "code": otp })
        if (response) {
          const updateNumber = await UserModel.findOneAndUpdate({ phone: phoneNumber }, { otp: otp })
          if (updateNumber) {
            return res
              .status(200)
              .json({ success: true, msg: "fetch successfully", });
          }
        }

      }
    }
    catch (error) {
      console.log(error.message);
    }
  };

  //check user for 7Days before
  static checkExistUSer = async (req, res) => {
    const id = req.body.id;
    let d = new Date();
    d.setDate(d.getDate() - 7);
    const checkExistUser = await UserModel.findOne({ _id: id });

    if (checkExistUser) {
      const checkRedisterDate = await UserModel.findOne({
        $and: [
          { createdAt: { $gt: d } },
          { _id: checkExistUser._id },
          { verifyStatus: true },
        ],
      });
      if (checkRedisterDate) {
        return res.status(200).json({
          success: false,
          msg: "You can retake the exam after 7 days from the date of your last attempt.",
        });
      } else {
        return res.status(200).json({ success: true });
      }
    }
  };

  //
  static calculateAllAnser = async (req, res) => {
    let resultantArr = [];
    const { exam_categories } = await ExamTypeModel.findOne({ slug: 'register_one' });
    const userAnswer = await AnswerModel.find({ examType: 'register_one' });
    // console.log(userANswer)
    // console.log(exam_categories)

    const arr1 = exam_categories.forEach((category) => {
      let obj = {};

      userAnswer.forEach((item1) => {
        const res = item1.answer.map((item) => {
          let rightAnswer = 0;
          let attempted = 0;
          if (item.category == category.category_id.toString() && item.answer == item.user_res) {
            rightAnswer++;
          } else if (item.category == category.category_id.toString() && item.answer != item.user_res) {
            attempted++;
          } else {
            // return 0;
          }
          return {
            question: item.question,
            right: rightAnswer,
            total: attempted + rightAnswer
          }
        })
        resultantArr.push(res)
      })

    })
    return res.status(200).json({ data: resultantArr })
  }

  static NumberVerification = async (req, res) => {
    try {
      let sms = msg91.getSMS();
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(200).json({ sucess: false, msg: "Phone Number is Required!" })
      }

      const getUserInfo = await UserModel.findOne({ phone: phoneNumber });

      if (getUserInfo) {
        const otp = Math.floor(100000 + Math.random() * 900000);


        const response = await sms.send("651bb085d6fc0568d06e53e2", { 'mobile': `91${phoneNumber}`, "code": otp })
        if (response) {
          const updateNumber = await UserModel.findOneAndUpdate({ phone: phoneNumber }, { otp: otp })
        }


        return res.status(200).json({ success: true, data: getUserInfo })
      } else {
        return res.status(200).json({ sucess: false, msg: "please register first!" })
      }

    } catch (error) {

    }

  }
  //check exam type
  static checkExamType = async (req, res) => {
    const { exam_type } = req.query;
    let numberOfQuestion = 0;
    const fetchExamType = await ExamTypeModel.findOne({ slug: exam_type });
    if (fetchExamType) {
      fetchExamType.exam_categories.forEach((item) => {
        numberOfQuestion += item.number_of_questions
      })
    }


    if (fetchExamType) {
      return res.status(200).json({ success: true, msg: 'fetch successfully', data: fetchExamType, question: numberOfQuestion })
    } else {
      return res.status(200).json({ success: false, msg: 'This exam not exist!' })
    }
  }
  static registeruser = async (req, res) => {
    try {

      const { name, email, phone } = req.body;
      function capitalizeFirstLetter(name) {
        return name.replace(/\b\w/g, function (char) {
          return char.toUpperCase();
        });
      }
      let updatedName = capitalizeFirstLetter(name);
      let d = new Date();
      d.setDate(d.getDate() - 7);
      const number = phone.split("");

      if (number.length < 10 || number.length > 10) {
        return res.status(200).json({ success: false, message: "Invalid phone number" });
      }

      const isExistUser = await UserModel.findOne({ phone: phone });

      if (isExistUser) {
        const updateStatus = await UserModel.findOneAndUpdate(
          { _id: isExistUser._id },
          { email: email, name: name }
        );
        return res
          .status(200)
          .json({ success: true, message: "user registred successfully", userId: isExistUser._id });
      } else {
        const user = new UserModel({
          name: updatedName,
          email: email,
          phone: phone,

        });

        const crearedUser = await user.save();

        return res.status(200).json({ success: true, message: 'user registred successfully', userId: crearedUser._id });
      }


    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };


}

export default User;