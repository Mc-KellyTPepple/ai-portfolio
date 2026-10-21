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
      // Clipboard API unavailable; the address is still visible on the button.
    }
  };

  return (
    <div className="contactActions">
      <a href={`mailto:${email}`} className="btn btnLight">
        Get in touch
      </a>
      <button type="button" onClick={handleCopy} className="copyChip">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span aria-live="polite">{copied ? "Copied to clipboard" : email}</span>
      </button>
    </div>
  );
}
