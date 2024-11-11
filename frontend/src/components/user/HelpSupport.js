import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import '../../styles/faq.css'; 

const HelpSupport = ({ userId }) => {
  const [issue, setIssue] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (issue.trim() === "") {
      alert("Please describe your issue.");
      return;
    }

    const db = getFirestore();
    try {
      await addDoc(collection(db, "supportTickets"), {
        userId,
        issue,
        status: "open",
        createdAt: new Date(),
      });
      setTicketSubmitted(true);
      setIssue("");
    } catch (error) {
      console.error("Error submitting support ticket: ", error);
    }
  };

  const faqs = [
    {
      question: "How do I request an e-waste pickup?",
      answer: "You can request a pickup through the 'Request Pickup' button in your dashboard."
    },
    {
      question: "What types of e-waste can be collected?",
      answer: "We collect electronic waste such as phones, laptops, batteries, and more."
    },
    {
      question: "How can I track my request?",
      answer: "You can track your e-waste pickup requests in the dashboard under 'My Requests'."
    },
    {
      question: "Is there any cost involved in e-waste disposal?",
      answer: "The service is free for registered users, but we offer incentives for responsible disposal."
    }
  ];

  return (
    <div>
      <h2>Help & Support</h2>
      
      <h3>FAQs</h3>
      {faqs.map((faq, index) => (
        <div key={index}>
          <h4>{faq.question}</h4>
          <p>{faq.answer}</p>
        </div>
      ))}

      <h3>Contact Support</h3>
      {ticketSubmitted ? (
        <p>Your ticket has been submitted. Our support team will get back to you shortly.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Describe your issue:</label>
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit Ticket</button>
        </form>
      )}
    </div>
  );
};

export default HelpSupport;
