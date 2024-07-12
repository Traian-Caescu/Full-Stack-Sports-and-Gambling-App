import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
        question: 'What steps can I take to start stopping gambling?',
        answer: 'Begin by acknowledging the problem, understanding the impact it has on your life, and reaching out for support from friends, family, or professionals. Self-exclusion from gambling sites and setting strict budget limits are practical first steps.'
    },
    {
        question: 'Are there any online resources for gambling addiction?',
        answer: 'Yes, many websites offer resources and tools to help manage gambling addiction, including self-assessment tests, educational material on gambling, and links to professional help like counselors and support groups.'
    },
    {
        question: 'How effective are self-exclusion programs?',
        answer: 'Self-exclusion programs can be very effective as part of a broader approach to quit gambling, by physically preventing access to gambling opportunities. However, they work best when combined with other treatment options, such as therapy and support groups.'
    },
    {
        question: 'Can therapy help with gambling addiction?',
        answer: 'Yes, therapy can be highly effective for gambling addiction. Cognitive Behavioral Therapy (CBT), in particular, helps individuals change the way they think about gambling and develop skills to cope with urges.'
    },
    {
        question: 'What should I do if someone I care about has a gambling problem?',
        answer: 'Support them by encouraging open discussions about their issues without judgment. Help them find professional support and, if possible, attend therapy or support groups with them to understand the addiction better.'
    },
    {
        question: 'Are there support groups for gambling addiction?',
        answer: 'Yes, support groups like Gamblers Anonymous provide peer support to help individuals stop gambling, offering a community of others who understand the challenges of addiction. These groups use a 12-step recovery program adapted from Alcoholics Anonymous.'
    }
];

  return (
    <section className="faq">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <div
          key={index}
          className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          onClick={() => toggleFAQ(index)}
        >
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p> 
        </div>
      ))}
    </section>
  );
};

export default FAQ;
