import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="bg-white dark:bg-brand-secondary p-8 rounded-lg shadow-lg prose dark:prose-invert max-w-none">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
        <p className="lead">Welcome to Madina Health Bot! Your privacy is critically important to us. This Privacy Policy explains how we collect, use, and protect your information when you interact with our chatbot. By using our services, you agree to the terms outlined in this document.</p>

        <h2>Information We Collect</h2>
        <ul>
          <li><strong>Personal Information:</strong> Includes your name, contact details, and any information you provide during interactions.</li>
          <li><strong>Health Information:</strong> General health-related data, such as symptoms or medical preferences.</li>
          <li><strong>Appointment Details:</strong> Data related to booking, rescheduling, or canceling appointments.</li>
          <li><strong>Feedback:</strong> Ratings and comments to improve our service quality.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li><strong>Appointment Management:</strong> To assist in booking, rescheduling, or canceling appointments.</li>
          <li><strong>Health Information Sharing:</strong> To provide general health tips, FAQs, and multilingual responses.</li>
          <li><strong>Emergency Assistance:</strong> To connect users with emergency contacts or notify hospital teams when necessary.</li>
          <li><strong>Feedback Collection:</strong> To gather user feedback for service improvement.</li>
          <li><strong>Escalation to Human Support:</strong> For unresolved or complex queries requiring human intervention.</li>
        </ul>

        <h2>Data Security</h2>
        <p>We are committed to protecting your data. Measures we take include:</p>
        <ul>
          <li>Adhering to regulations like HIPAA to handle sensitive health information securely.</li>
          <li>Employing encryption to safeguard data during storage and transmission.</li>
          <li>Restricting access to authorized personnel only.</li>
        </ul>

        <h2>Third-Party Integrations</h2>
        <p>Madina Health Bot integrates with third-party systems for better service delivery. These include:</p>
        <ul>
          <li><strong>Hospital Databases:</strong> For managing appointment schedules and doctor availability.</li>
          <li><strong>SMS/Email Services:</strong> For sending notifications and updates.</li>
          <li><strong>APIs:</strong> To securely retrieve and manage patient information.</li>
        </ul>

        <h2>Compliance with Regulations</h2>
        <p>We comply with applicable healthcare data protection laws, such as HIPAA, ensuring that your information is handled responsibly and securely.</p>

        <h2>Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy periodically. Changes will be posted on this page, and your continued use of our services constitutes acceptance of the updated terms.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
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

export default PrivacyPolicyPage;
