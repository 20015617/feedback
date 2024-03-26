import React from "react";
import styles from "./Home.module.css";

function FeedbackList({ feedbackList, variant }) {
  return (
    <div>
      {feedbackList && feedbackList.length > 0 ? (
        <ul className={styles.feedbackList}>
          {feedbackList.map((item) => (
            <li className={styles.feedbackListItem} key={item._id}>
              <h3>
                {variant === "manager"
                  ? `Feedback by ${item.userId.email} on ${new Date(
                      item.createdAt
                    ).toLocaleString()}:`
                  : `Your feedback on ${new Date(
                      item.createdAt
                    ).toLocaleString()}:`}
              </h3>
              <p>{item.feedback}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No feedbacks found.</p>
      )}
    </div>
  );
}

export default FeedbackList;
