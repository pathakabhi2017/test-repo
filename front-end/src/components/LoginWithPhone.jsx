import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth';

const LoginWithPhone = () => {
  const [getNumber, setNumber] = useState('');
  const [showOtpField, setShowOtpField] = useState(true);
  const [checkExam, setCheckExam] = useState(false);
  const [id, setId] = useState('');
  const [otp, setOtp] = useState('');
  const [auth, setAuth] = useAuth()
  // const [setHomeContent] = useAuth();
  const navigate = useNavigate();
  const search = useLocation().search;
  const exam_type = new URLSearchParams(search).get("exam_type");



  const getUserInfo = async () => {

    const mobile = getNumber.replaceAll(" ", "").slice(-10);
    if (!getNumber) {
      toast.error("Mobile Number required!")
    }
    else if (mobile.length < 10) {
      toast.error("Please Enter registerd Mobile Number!")
    } else {
      const { data } = await axios.post('/api/v2/verify-number', {
        phoneNumber: mobile

      })

      if (data.success) {
        setId(data.data._id);
        setShowOtpField(false);
        toast.success("otp send successfully")
      }
      else {
        toast.error(data.msg);
        navigate('/register')
      }
    }


  }
  const resendOtp = async () => {
    try {
      const mobile = getNumber.replaceAll(" ", "").slice(-10);
      if (!getNumber) {
        toast.error("Mobile Number required!")
      }
      else if (mobile.length < 10) {
        toast.error("Please Enter registerd Mobile Number!")
      } else {
        const { data } = await axios.post(
          "/api/v2/resend-otp",
          {
            id: id,
            phoneNumber: mobile
          }
        );

        if (data.success) {
          setOtp("");
          toast.success("OTP Resend Successfully");

        } else {
          toast.error(data.msg)
        }
      }


    } catch (error) {
      toast.error(error.message);
      window.location.href = "https://www.inboundacademy.in/";
    }
  }
  const verifyUser = async () => {
    try {
      const { data } = await axios.post(
        `/api/v2/login`,
        {
          otp: otp,
          phone: getNumber,
        }
      );
      if (data.success) {
        toast.success(data.userInfo.message);
        setAuth({
          ...auth,
          user: data.userInfo,
          token: data.token

        });
        // getCameraAccess();
        // console.log(auth);
        localStorage.setItem("auth", JSON.stringify(data));

        navigate(`/exams?userId=${data.userInfo._id}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    const checkType = async () => {
      const { data } = await axios.get(`/api/v2/type?exam_type=${exam_type}`);
      if (data.success) {
        // setHomeContent({ numberOfQuestion: data.question, time: data.examTime })
        setCheckExam(true)
      }
    }
    // checkType()
  }, [])
  return (
    <>

      <div class="otp_wraper">
        <div class="otp_form">
          <div class="logo_otp text-center">
            <a target="_blank" href="#">
              <img
                width="170"
                src="images/inbound-academy-logo.webp"
                alt="Logo"
              />
            </a>
          </div>
          <div class="otp_content text-center">
            <h3>Verify Mobile</h3>
            {/* <p>Enter the OTP (One Time Password) Sent to +91 {auth.user.phone}</p> */}
            <p>
              Please provide the OTP (One Time Password) that was sent for
              verification to your registered mobile number.
            </p>
            {showOtpField ? <div className='number-container'>
              <input style={{ flex: '0 0 71%' }}
                onChange={(e) => setNumber(e.target.value)}
                value={getNumber}
                type="text"
                placeholder="Enter Phone Number here"
                required
              />

              <button className="btn" onClick={getUserInfo}>
                SEND OTP
              </button>


            </div>
              : <div className='number-container'>
                <input style={{ flex: '0 0 71%' }}
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  type="text"
                  placeholder="Enter Otp here"
                  required
                />

                <button className="btn" type="submit" onClick={verifyUser}>
                  VERIFY OTP
                </button>
              </div>

            }
          </div>
          <div class="otp_resend text-center">
            <p>Check your Phone for the OTP</p>
            <button onClick={resendOtp} className="btn">
              Resend OTP
            </button>
            <Link className='btn' to={'/register'} style={{ textDecoration: 'none' }}>Register</Link>
          </div>
        </div>
      </div>

    </>

  )
}

export default LoginWithPhone