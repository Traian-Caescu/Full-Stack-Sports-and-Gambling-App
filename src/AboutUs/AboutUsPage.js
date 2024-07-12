import React from 'react';
import Introduction from './Introduction';
import GamblingStatistics from './GamblingStatistics';
import SupportOffered from './SupportOffered';
import SuccessStories from './SuccessStories';
import ContactInfo from './ContactInfo';

function AboutUsPage() {
    return (
  <>
    <main className="AboutUsPage">
      <Introduction />
      <GamblingStatistics />
      <SupportOffered />
      <SuccessStories />
      <ContactInfo />
    </main>
  </>
);
}
export default AboutUsPage;

