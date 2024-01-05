import mongoose from "mongoose";
import answer from "../models/answer.js";
import QuestionResponse from '../models/answer_response.js';
import Categories from "../models/categories.js";
import ExamType from "../models/exam_type.js";
import QuestionModel from "../models/question.js";


class Question {
  static calculateQuestionInfo = async (req, res) => {
    try {
      const examName = req.body.exam_name;
      const { userId } = req.body;
      const checkPendingTest = await QuestionResponse.findOne({ userId: userId });
      if (checkPendingTest) {
        return res.status(200).json({ success: 201, data: checkPendingTest })
      }
      const checkExamName = await ExamType.findOne({
        $and: [{ slug: examName }, { status: "Active" }],
      });
      // console.log(checkExamName)
      if (!checkExamName) {
        return res
          .status(200)
          .json({ success: false, msg: "This Exam does not exists!" });
      }
      const fetchCategoryInfo = await ExamType.aggregate([
        { $match: { slug: examName } },
        { $unwind: "$exam_categories" },
        {
          $lookup: {
            from: "categories",
            localField: "exam_categories.category_id",
            foreignField: "_id",
            as: "data",
          },
        },
        { $unwind: "$data" },
        {
          $addFields: {
            category_name: "$data.slug",
            number_of_question: "$exam_categories.number_of_questions",
          },
        },
        {
          $project: {
            category_name: 1, number_of_question: 1, _id: "$data._id",
            exam_time: 1
          },
        },
      ]);

      // console.log(fetchCategoryInfo)
      const obj1 = {};

      fetchCategoryInfo.forEach((item, index) => {
        obj1[item._id] = item.number_of_question;
      });

      const promises = [];

      Object.entries(obj1).forEach(([key, value]) => {
        promises.push(this.getQuestionsForCategory(key, value));
      });

      const results = await Promise.all(promises);


      const resp = results.flat();
      return res.status(200).json({ success: 200, data: resp, examTiming: fetchCategoryInfo[0].exam_time });

    } catch (error) {
      console.log(error.message);
    }
  };

  static shuffledQuestions = async (req, res) => {
    try {
      const obj = req.body;
      const promises = [];

      Object.entries(obj).forEach(([key, value]) => {
        promises.push(getQuestionsForCategory(key, value));
      });
      const results = await Promise.all(promises);
      const resp = results.flat();
      return res.status(200).json({ data: resp });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ data: error.message });
    }
  };

  // async function getQuestionsForCategoryOld(category, limit) {
  //   const getCategoryName = await Categories.findOne({ _id: category });
  //   const questions = await QuestionModel.aggregate([
  //     { $match: { category: new mongoose.Types.ObjectId(category) } },
  //     { $addFields: { user_res: null, category_name: getCategoryName.name } },
  //     { $limit: parseInt(limit) },
  //   ]);

  //   return questions;
  // }

  static async getQuestionsForCategory(category, limit) {
    const getCategoryName = await Categories.findOne({ _id: category });
    const questions = await QuestionModel.aggregate([
      { $match: { category: new mongoose.Types.ObjectId(category) } },
      { $addFields: { user_res: null, category_name: getCategoryName.name } },
      // { $limit: parseInt(limit) },
    ]);
    // const questions = await QuestionModel.aggregate([
    //   { $match: { category: category } },
    //   { $addFields: { user_res: null } },
    // ]);
    return this.shuffleAndReduce(questions, parseInt(limit));
  }

  static shuffleAndReduce(array, newSize) {
    const shuffledArray = [...array];
    // console.log('newSize:', newSize);
    // console.log('shuffledArray_length:', shuffledArray.length);
    while (shuffledArray.length > newSize) {
      const randomIndex = Math.floor(Math.random() * shuffledArray.length);
      shuffledArray.splice(randomIndex, 1);
    }
    // console.log(shuffledArray);

    return shuffledArray;
  }

  //
  static questionListController = async (req, res) => {
    try {
      const perPage = 6;
      const page = req.params.page ? req.params.page : 1;
      const quesons = await QuestionModel.find({}, { option: 0 });
      const questions = await QuestionModel.find({}, { option: 0 })

        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        questions,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };

  //save uesr question response
  static saveQuestionsReponse = async (req, res) => {
    try {
      const { userId, answer, questionTime, userIndexValue, exam_type } = req.body;

      const fetchQuestion = await QuestionResponse.findOne({ userId: userId });
      const { _id } = await ExamType.findOne({ slug: exam_type })
      if (fetchQuestion) {
        const updateQuestion = await QuestionResponse.findOneAndUpdate({ _id: fetchQuestion._id }, {
          userQuestion: answer,
          questionTime: questionTime,
          userIndexValue: userIndexValue,
          exam_type: _id
        }, { new: true })
        // console.log(updateQuestion)
        return res.status(200).json({ success: true })

      }
      else {
        const createQuestion = new QuestionResponse({
          userQuestion: answer,
          questionTime: questionTime,
          userId: userId,
          exam_type: _id
        })
        await createQuestion.save();
        return res.status(200).json({ success: true })
      }
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message })
    }

  }
  static getallexamslist = async (req, res) => {

    const AllExamslist = await ExamType.find({
      $and: [{ status: "Active" }],
    }, { _id: 1, exam_name: 1, slug: 1 });


    const { userId } = req.body;

    const DoneExamslist = await answer.find({
      $and: [{ userId: new mongoose.Types.ObjectId(userId) }],
    }, { _id: 0, examTypeId: 1 });

    const PendingExamslist = await QuestionResponse.find({
      $and: [{ userId: new mongoose.Types.ObjectId(userId) }],
    }, { _id: 0, exam_type: 1 });


    if (AllExamslist) {
      return res

        .status(200)

        .json({
          success: true,
          message: "Exams list",
          examsall: AllExamslist,
          doneexams: DoneExamslist,
          PendingExamslist: PendingExamslist,
        });
    } else {

      return res.status(200).json({ success: false, message: "No exams find" });

    }
  }

}

export default Question;














