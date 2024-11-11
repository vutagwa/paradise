import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const FeedbackForm = ({ userId }) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (feedbackText.trim() === "") {
      alert("Please enter your feedback.");
      return;
    }

    const db = getFirestore();
    try {
      await addDoc(collection(db, "feedback"), {
        userId,
        feedbackText,
        suggestions,
        createdAt: new Date(),
      });
      setFeedbackSubmitted(true);
      setFeedbackText("");
      setSuggestions("");
    } catch (error) {
      console.error("Error submitting feedback: ", error);
    }
  };

  return (
    <div>
      <h2>User Feedback</h2>
      {feedbackSubmitted ? (
        <p>Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Feedback:</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Suggestions (optional):</label>
            <textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
            />
          </div>
          <button type="submit">Submit Feedback</button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
