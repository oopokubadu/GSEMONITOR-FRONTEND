import React from "react";
import Link from "next/link";
import Footer from "@/components/landing-footer";

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <Link
              href="/"
              className="inline-block px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              Back to Home
            </Link>
          </div>
          <p className="mb-4">
            By using <span className="font-semibold">Chopmoney</span>, you agree to the following terms:
          </p>

          <h2 className="text-2xl font-semibold mt-6">User Responsibilities:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are solely responsible for maintaining the confidentiality of your account credentials (username, password, and any other login details).</li>
            <li>You are accountable for all activities that occur under your account, whether or not authorized by you.</li>
            <li>You agree to provide accurate, current, and complete information when creating or updating your account.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Acceptable Use:</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You agree to use Chopmoney only for lawful purposes and in accordance with these Terms of Use.</li>
            <li>You must not use the app for any illegal, fraudulent, or unauthorized purpose, including but not limited to money laundering, scams, or impersonation.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Indemnification:</h2>
          <p className="mb-4">
            You agree to indemnify and hold harmless Chopmoney, its affiliates, officers, agents, and employees from any claim or liability arising from your use of the app, including legal fees incurred by third parties due to your actions.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Account Suspension or Termination:</h2>
          <p className="mb-4">
            We reserve the right to suspend or terminate your account without prior notice if you violate these terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Updates to Terms:</h2>
          <p className="mb-4">
            We may update these Terms of Use at any time. Continued use of the app after such changes implies acceptance of the revised terms.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Agreement:</h2>
          <p className="mb-4">
            By using Chopmoney, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Use and our Privacy Policy.
          </p>

          <p className="text-gray-500 text-xs mt-8 text-right">Last updated: May 2025</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
