import React, { useState } from 'react';
import './ContactInfo.css';
import { db } from '../firebase-config'; 
import { collection, addDoc } from "firebase/firestore";

const ContactInfo = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      await addDoc(collection(db, "contactUs"), {
        ...formData,
        timestamp: new Date()
      });
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' }); // Clear form data
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Failed to send message. Please try again later.');
    }
  };

  return (
    <section className="contactInfo">
      <h2>Contact Us</h2>
      <p>If you or someone you know is struggling with gambling addiction, our team is here to help. You can reach out to us through various channels:</p>
      
      <ul>
        <li>Email: <a href="mailto:traian0345@gmail.com">traian0345@gmail.com</a></li>
        <li>Phone: <a href="tel:+1234567890">+44 7717308620</a></li>
        <li>24/7 Helpline: <a href="tel:+0987654321">+44 7717308620</a></li>
      </ul>
      
      <p>Follow us on social media for updates and resources:</p>
      <ul className="socialLinks">
        <li><a href="#">Facebook</a></li>
        <li><a href="#">Twitter</a></li>
        <li><a href="#">Instagram</a></li>
      </ul>

      <p>You can also leave us a message below, and we'll get back to you as soon as possible:</p>
      <form className="contactForm" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
        <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </section>
  );
};

export default ContactInfo;
