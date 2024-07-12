import React from 'react';
import './SuccessStories.css';

const successStories = [
  {
    name: "Alex Johnson",
    story: "Finding support within this community gave me the courage to face my gambling addiction head-on. Today, I celebrate two years of living free from the chains of gambling, thanks to the continuous support and resources I found here.",
    date: "April 12, 2022"
  },
  {
    name: "Jordan Smith",
    story: "The journey from the depth of despair to reclaiming my life seemed impossible until I joined the support groups here. The counseling sessions, coupled with real stories of recovery, have shown me that change is indeed possible.",
    date: "June 8, 2022"
  },
];

const SuccessStories = () => (
  <section className="successStories">
    <h2>Inspirational Success Stories</h2>
    <div className="storiesContainer">
      {successStories.map((story, index) => (
        <div key={index} className="story">
          <h3>{story.name}</h3>
          <p className="storyDate">{story.date}</p>
          <p>{story.story}</p>
        </div>
      ))}
    </div>
  </section>
);

export default SuccessStories;
