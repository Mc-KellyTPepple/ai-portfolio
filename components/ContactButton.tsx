"use client";

import { useState } from "react";

export default function ContactButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; user can still read the email below.
    }
  };

  return (
    <div className="contactActions">
      <a href={`mailto:${email}`} className="primaryButton">
        Get In Touch
      </a>
      <button type="button" onClick={handleCopy} className="copyButton">
        {copied ? "Copied!" : email}
      </button>
    </div>
  );
}