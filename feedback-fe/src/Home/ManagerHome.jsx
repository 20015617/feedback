import React, { useEffect, useState } from "react";
import FeedbackList from "./FeedbackList";
import styles from "./Home.module.css";
import axios from "axios";

const getFeedback = () =>
  axios.get("https://feedback-yd5z.onrender.com/api/getManagerFeedbacks", {
    headers: {
      authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
    },
  });

function ManagerHome() {
  const [feedBackList, setFeedBackList] = useState([]);

  const refreshFeedback = () =>
    getFeedback().then((res) => {
      console.log("res", res);
      setFeedBackList(res.data.response);
    });

  useEffect(() => {
    refreshFeedback();
  }, []);
  return (
    <div className={styles.container}>
      <h4>Feedback by your team:</h4>
      <FeedbackList variant="manager" feedbackList={feedBackList} />
    </div>
  );
}

export default ManagerHome;
