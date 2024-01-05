const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const User = require("../models/User");
const Admin =  require("../models/Admin");
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchUser');
global.numberp = "";
global.user_id = "";
global.user_name = "";

dotenv.config({path:"config.env"})


  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_SERVICE_SID = process.env.TWILIO_SERVICE_SID;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

// const JWT_SECRET = ""

// ROUTE 1 : create a User using POST "/api/auth/createuser". doesn't require Auth
router.post(
  "/createuser",
  [
    check("name").isLength({ min: 3 }),
    check("email").isEmail(),
    check("phone").isLength({ min: 5 }),
  ],
  async (req, res) => {
    var success = false;
    // If there are errors, return that req and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // check whether the user with this email exists already
      let user = await User.findOne({ phone: req.body.phone });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "sorry a user with this phone already exists" });
      }
      // using bcrypt
      
      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      });
      //   .then(user => res.json(user))
      // .catch(err=> console.log(err));
      // res.json({error: 'please enter a unique value for email', message: err.message})

      const data = {
        user: {
          id: user.id
        }
      }
      const JWT_SECRET = "helloiamsecret"
      const authToken = jwt.sign(data, JWT_SECRET);

      //res.json(use)
      success = true;
      // console.log(jwtData);
      res.json({success, authToken});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured")
    }
  }
);





// ROUTE 2 : Authenticate a User using POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    check("phone", 'Enter a valid phone').isNumeric()
    .isLength({ min: 10 }),
    //body("password", 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    //console.log(req.body.phone)
    var success = false;
     // If there are errors, return bad req and the errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     numberp = req.body.phone;
     try {
      // to find whether the exists or not
      let user = await User.findOne({phone: req.body.phone});
      // if user doesnt exist
      if(!user){
      //  success: false;

        return res.status(400).json({error: "Please try to login with correct credentials"});
      }

//console.log(user); 
      if(user){

        client.verify.v2
        .services(TWILIO_SERVICE_SID)
        .verifications.create({ to: `+91${req.body.phone}`, channel: "sms" })
        .then((verification) => {
          //console.log(verification.status);
          //return verification.status;
          user_id = user.id
          user_name = user.name
          
          // 
     
        //const JWT_SECRET = "helloiamsecret";
        //const authToken = jwt.sign(data, JWT_SECRET);
       success = true;
        res.json({success});
        })
        .catch((e) => {
          console.log(e);
          //return e;
        });



      
      }


      

     } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error")
     }
  });


  // ROUTE 3 : Get logged in User details using : POST "/api/auth/getuser" .Login required
  router.post( "/getuser", fetchuser, async (req, res) => {

      try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
      }
    });     
    
    
 // ROUTE 4 : Send user login otp using : POST "/api/auth/sendOtp"

  router.post( "/sendOtp",  async (req, res) => {
  const  phoneNumber  = req.body.phone;

  try {
    const result = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verifications.create({
        to: `+91${phoneNumber}`,
        channel: "sms",
      });
    res.status(200).send({
      success: true,
      message: `OTP sent successfully`,
      payload: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: `Error in sending otp: ${err.message}`,
    });
  }
});

 // ROUTE 4 : Verify user login otp using : POST "/api/auth/verifyOtp"
router.post( "/verifyOtp",  async (req, res) => {
//console.log(user_name);
  const otp = req.body.otp;
  const data = {
    user: {
      id: user_id,
      name: user_name
    }
  }
  const JWT_SECRET = "helloiamsecret"
  const authToken = jwt.sign(data, JWT_SECRET);
  try {
    const result = await client.verify.v2
      .services(TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${numberp}`,
        code: otp,
      });
      
    res.status(200).send({
      success: true,
      message: `OTP verified successfully`,
      payload: result,
      authToken: authToken,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: `Error in verifying otp: ${err.message}`,
    });
  }
});


// ROUTE 2 : Authenticate a User using POST "/api/auth/login". No login required
router.post(
  "/admin-login",
  [
    check("email", 'Enter a valid email').isEmail(),
    check("password", 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    var success = false;
     // If there are errors, return bad req and the errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }

     const { email, password } = req.body;
     try {
      // to find whether the exists or not
    
      let admin = await Admin.findOne({email});
      //console.log(admin)
      // if admin doesnt exist
      if(!admin){
      //  success: false;

        return res.status(400).json({error: "Please try to login with correct credentials"});
      }

      // to match the hashes internally and returns true/false
      const passwordCompare = await bcrypt.compare(password, admin.password);
      if(!passwordCompare){
        success: false;
        return res.status(400).json({success, error: "Please try to login with correct credentials"});
      }

      // 
      const data = {
        user: {
          id: admin.id
        }
      }
      const JWT_SECRET = "helloiamsecret";
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken});

     } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error")
     }
  });


module.exports = router;
