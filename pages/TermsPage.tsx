import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="bg-white dark:bg-brand-secondary p-8 rounded-lg shadow-lg prose dark:prose-invert max-w-none">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Terms and Conditions</h1>
        <p className="lead">Welcome to Madina Health Bot! These Terms and Conditions outline the rules and guidelines for using our services. By accessing or using Madina Health Bot, you agree to be bound by these terms. If you disagree with any part of these terms, you should discontinue using our chatbot immediately.</p>

        <h2>Use of Services</h2>
        <h3>Purpose of the Chatbot:</h3>
        <ul>
            <li>Madina Health Bot is designed to provide healthcare assistance, including managing appointments, delivering health-related information, and offering emergency contact support.</li>
            <li>The chatbot is not a substitute for professional medical advice, diagnosis, or treatment.</li>
        </ul>
        <h3>Permitted Usage:</h3>
        <ul>
            <li>You may use the chatbot for lawful purposes only.</li>
            <li>You must not misuse the chatbot, disrupt its operations, or attempt unauthorized access.</li>
        </ul>
        <h3>Limitations:</h3>
        <ul>
            <li>The chatbot provides general health tips and information but does not offer personalized medical advice.</li>
            <li>Users are advised to consult with qualified healthcare professionals for specific medical concerns.</li>
        </ul>

        <h2>User Responsibilities</h2>
        <h3>Accuracy of Information:</h3>
        <ul>
            <li>You are responsible for providing accurate and complete information during interactions with the chatbot.</li>
            <li>Misrepresentation of information may lead to incorrect outcomes or restricted access.</li>
        </ul>
        <h3>Security:</h3>
        <p>Users must safeguard their login credentials (if applicable) and notify us immediately of any unauthorized access or breaches.</p>
        <h3>Feedback and Communication:</h3>
        <p>Feedback provided by users must be respectful and constructive. Misuse of feedback channels may result in service restrictions.</p>

        <h2>Intellectual Property</h2>
        <h3>Ownership:</h3>
        <p>All content, features, and functionality of Madina Health Bot, including text, graphics, software, and design, are the exclusive property of Madina Health.</p>
        <h3>Restrictions:</h3>
        <p>Users may not copy, modify, distribute, or reverse-engineer any part of the chatbot or related services.</p>

        <h2>Limitation of Liability</h2>
        <h3>General Liability:</h3>
        <p>Madina Health Bot and its creators are not liable for any direct, indirect, incidental, or consequential damages arising from the use of the chatbot.</p>
        <h3>Service Interruptions:</h3>
        <p>We are not responsible for interruptions, errors, or data loss resulting from technical issues or third-party integrations.</p>

        <h2>Termination of Access</h2>
        <p>We reserve the right to suspend or terminate user access to Madina Health Bot at any time, without notice, for violating these terms or engaging in activities that harm the service or its users.</p>

        <h2>Changes to Terms</h2>
        <p>These terms and conditions may be updated periodically. Users are responsible for reviewing them regularly. Continued use of the chatbot constitutes acceptance of the updated terms.</p>

        <h2>Governing Law</h2>
        <p>These terms are governed by the laws of [Your Country/State]. Any disputes arising from these terms will be resolved under the applicable jurisdiction.</p>

        <h2>Contact Us</h2>
        <p>For any questions, concerns, or feedback regarding these Terms and Conditions, please contact us at:</p>
        <p><a href="mailto:support@mohchatbot.com">support@mohchatbot.com</a></p>

        <div className="mt-10 text-center">
            <Link to="/" className="bg-brand-accent text-white font-bold py-3 px-6 rounded-md hover:bg-sky-400 transition-colors no-underline">
                &larr; Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
