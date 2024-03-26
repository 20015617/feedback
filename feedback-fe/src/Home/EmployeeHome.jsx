import React, { useEffect, useState } from "react";
import FeedbackList from "./FeedbackList";
import styles from "./Home.module.css";
import axios from "axios";

const postFeedback = (feedback) =>
  axios.post(
    "https://feedback-yd5z.onrender.com/api/submitFeedback",
    {
      feedback,
    },
    {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    }
  );

const getFeedback = () =>
  axios.get("https://feedback-yd5z.onrender.com/api/getEmployeeFeedback", {
    headers: {
      authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
    },
  });

function EmployeeHome({ setIsLoggedIn, setIsManager }) {
  const [feedBack, setFeedBack] = useState("");
  const [message, setMessage] = useState("");
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
      <button
        className={styles.logoutButton}
        type="button"
        onClick={() => {
          setIsLoggedIn(false);
          setIsManager(false);
          sessionStorage.clear();
        }}
      >
        Logout
      </button>
      <form>
        <fieldset className={styles.fieldSetContainer}>
          <legend>Enter new feedback:</legend>
          <textarea
            name="feedback"
            type="textarea"
            rows={10}
            cols={50}
            value={feedBack}
            onChange={(event) => {
              setFeedBack(event.target.value);
              setMessage("");
            }}
          />
          {message && <p>{message}</p>}
          <button
            type="button"
            onClick={() => {
              if (feedBack) {
                postFeedback(feedBack)
                  .then(() => {
                    setMessage("Feedback submitted!");
                    setFeedBack("");
                    refreshFeedback();
                  })
                  .catch((error) => {
                    setMessage(error.response.data.message);
                  });
              }
            }}
          >
            Submit
          </button>
        </fieldset>
      </form>
      <h4>Past feedbacks by you:</h4>
      <FeedbackList variant="employee" feedbackList={feedBackList} />
    </div>
  );
}

export default EmployeeHome;
