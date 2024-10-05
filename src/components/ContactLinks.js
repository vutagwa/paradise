import React from 'react';
import instagramImg from './Assets/ig.jpg';
import twitterImg from './Assets/X.jpeg';
import emailImg from './Assets/email.jpg';
import whatsappImg from './Assets/whats.jpg';

const ContactLinks = () => {
  return (
    <div className="contact-links">
      <h3>Connect with us:</h3>
      <ul>
        <li>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagramImg} alt="Instagram" className="contact-icon" />
          </a>
        </li>
        <li>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={twitterImg} alt="Twitter" className="contact-icon" />
          </a>
        </li>
        <li>
          <a href="mailto:example@example.com">
            <img src={emailImg} alt="Email" className="contact-icon" />
          </a>
        </li>
        <li>
          <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
            <img src={whatsappImg} alt="WhatsApp" className="contact-icon" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ContactLinks;
