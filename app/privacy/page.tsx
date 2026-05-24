import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CKF",
  description: "Car Known Faults privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-slate">
      <h1>Privacy Policy</h1>
      <p><strong>Last updated: May 2026</strong></p>

      <h2>Who we are</h2>
      <p>Car Known Faults (CKF) is operated by Two Bit Digital Ltd, a company registered in England and Wales.</p>

      <h2>Data we collect</h2>
      <ul>
        <li><strong>Analytics:</strong> We use Google Analytics 4 and Vercel Analytics to understand site usage. No personally identifiable information is collected.</li>
        <li><strong>Fault submissions:</strong> If you submit a fault, we store the information you provide (make, model, description). An email address is optional and never published.</li>
        <li><strong>Advertising:</strong> We use Google AdSense which may use cookies to serve relevant ads.</li>
      </ul>

      <h2>Cookies</h2>
      <p>This site uses functional cookies (for analytics and advertising). No login cookies are used by public visitors.</p>

      <h2>Your rights</h2>
      <p>Under UK GDPR, you have the right to access, correct, or delete personal data we hold. Contact us at <a href="mailto:privacy@carknownfaults.com">privacy@carknownfaults.com</a>.</p>

      <h2>Third parties</h2>
      <p>We may include affiliate links to Amazon, Euro Car Parts, and similar retailers. These are clearly identified. We are not responsible for third-party privacy practices.</p>

      <h2>Contact</h2>
      <p>Two Bit Digital Ltd · <a href="mailto:hello@carknownfaults.com">hello@carknownfaults.com</a></p>
    </div>
  );
}
