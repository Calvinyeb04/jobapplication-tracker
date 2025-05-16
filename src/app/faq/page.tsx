'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Client component for FAQ items with toggle functionality
const FAQItem = ({ question, answer }: { question: string; answer: string | React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-2">{question}</h3>
        <span className="ml-2 flex-shrink-0 text-indigo-600">
          {isOpen ? <FaChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <FaChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
        </span>
      </button>
      {isOpen && (
        <div className="mt-3 pr-4 sm:pr-12">
          <p className="text-sm sm:text-base text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

// Make FAQItem a client component
const ClientFAQItem = FAQItem;

export default function FAQPage() {
  const faqs = [
    {
      question: "What is AstroTracker?",
      answer: "AstroTracker is an all-in-one job application tracking platform that helps you organize your job search journey. It allows you to track applications, manage interviews, generate cover letters, and receive personalized job recommendations."
    },
    {
      question: "Is AstroTracker free to use?",
      answer: "Yes, AstroTracker is currently free to use for all users. We may introduce premium features in the future, but our core functionality will always remain free."
    },
    {
      question: "How do I get started with AstroTracker?",
      answer: "Simply sign up for an account, and you'll be guided through the setup process. You can start by adding your first job application and exploring the dashboard to get familiar with the features."
    },
    {
      question: "Can I import my existing job applications?",
      answer: "Currently, we don't have a bulk import feature. However, you can manually add your existing applications one by one. We're working on adding an import feature in the future."
    },
    {
      question: "How does the AI cover letter generator work?",
      answer: "Our AI cover letter generator uses information from your profile and the job description to create tailored cover letters. Simply input the job details, and the AI will generate a personalized cover letter that you can edit and download."
    },
    {
      question: "Can I track multiple job searches at once?",
      answer: "Absolutely! AstroTracker allows you to track as many job applications as you need, and you can organize them by company, status, or custom tags."
    },
    {
      question: "How do I get job recommendations?",
      answer: "Our recommendation engine analyzes your profile, skills, and previous applications to suggest relevant job opportunities. The more you use AstroTracker, the more personalized your recommendations will become."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All data is encrypted, and we follow industry best practices to ensure your information remains private and secure."
    },
    {
      question: "Can I set reminders for interviews and follow-ups?",
      answer: "Yes, AstroTracker includes a reminder system for interviews, follow-ups, and application deadlines. You can receive notifications via email or in-app alerts."
    },
    {
      question: "How can I provide feedback or report issues?",
      answer: "We welcome your feedback! You can reach out to us through the contact information provided on our About page, or by using the feedback form in the application."
    }
  ];

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 max-w-4xl">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Frequently Asked Questions</h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Find answers to common questions about using AstroTracker
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8">
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <ClientFAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-3 sm:mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-5 sm:mb-6">
            If you can't find the answer you're looking for, please reach out to our team.
          </p>
          <a
            href="mailto:yeboahcalvin04@gmail.com"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
} 