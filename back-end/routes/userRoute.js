
import express from "express";
import multer from 'multer';
import Question from '../controller/Question.js';
import Users from '../controller/User.js';
import Authentication from '../controller/auth.js';


const upload = multer();
const router = express.Router();


router.post("/register", Users.register);
router.post("/login", Users.login);
router.post("/resend-otp", Users.resendOtp);
router.get("/login/exist-user", Users.loginExistUser);
router.post("/seven-days", Authentication.requireSignIn, Users.checkExistUSer);
router.post("/user-score", Users.calculateUserScore);
router.post("/answer-response", upload.none(), Users.insertUserAnswerInfo);
router.post("/questions", upload.none(), Question.calculateQuestionInfo);
router.post('/calculatAlleAnswer', Users.calculateAllAnser);
router.post('/verify-number', Users.NumberVerification)
router.get('/type', Users.checkExamType);
router.post('/save-questions-response', upload.none(), Question.saveQuestionsReponse)
router.post('/registeruser', Users.registeruser)
router.post('/getallexamslist', Question.getallexamslist)

export default router;



