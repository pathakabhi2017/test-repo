import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth";

const Home = () => {
  const [auth, setAuth] = useAuth();
  // const search = useLocation().search;
  // const exam_type = new URLSearchParams(search).get("exam_type");
  const [content, setContent] = useState({})
  const navigate = useNavigate();

  const checkUserValidation = async () => {
    try {
      const { data } = await axios.post(
        "/api/v2/seven-days",
        {
          id: auth.user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success) {

        navigate(`/question?exam_type=${auth.type}`);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error.message);
      // window.location.href = "https://www.inboundacademy.in/";
    }
  };
  useEffect(() => {

    const checkType = async () => {
      const { data } = await axios.get(`/api/v2/type?exam_type=${auth.type}`);

      if (data.success) {
        setContent(data.data)

      }
    }
    checkType()
  }, [])
  //
  return (
    <>
      <div class="content_wraper">
        <div class="logo">
          <div class="container">
            <a target="_blank" href="https://www.inboundacademy.in/">
              <img src="images/inbound-academy-logo.webp" alt="Logo" />
            </a>
          </div>
        </div>
        <div class="body_content">
          <div class="container">
            <div class="exam_start">
              <div class="exam_start_cnt">
                <div class="exam_img">
                  <img width="100%" src={content.image} alt="images/00-home.png" />
                </div>
                <div class="exam_guid">
                  <h2>Transfunnel Aptitude Test</h2>
                  <div dangerouslySetInnerHTML={{ __html: content.content }}>
                    {/* {content} */}
                  </div>
                  {/* {`${content.content}`} */}
                </div>
              </div>
              <div class="exam_start_cta text-center">
                <button onClick={checkUserValidation} className="btn">
                  Start Exam
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer class="text-center">
          <div class="container">
            Copyright © 2023.{" "}
            <a href="https://www.transfunnel.com/" target="_blank">
              TransFunnel Consulting
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
