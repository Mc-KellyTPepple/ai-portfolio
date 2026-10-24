"use client";

import { useState } from "react";
import ServiceStatus from "@/components/ServiceStatus";

type Props = {
  probe: string;
  label: string;
  appUrl: string;
  /** Show the app inside the page once the server is awake. */
  embed: boolean;
  openLabel: string;
  frameTitle: string;
  /** Optional extra button, e.g. "Request an access code". */
  extra?: { href: string; label: string };
};

export default function DemoSection({
  probe,
  label,
  appUrl,
  embed,
  openLabel,
  frameTitle,
  extra,
}: Props) {
  const [ready, setReady] = useState(false);
  const canOpen = ready || !embed;

  return (
    <div className="demoWrap">
      <ServiceStatus
        probe={probe}
        label={label}
        onOnline={() => setReady(true)}
        readyText={
          embed
            ? "The server is awake. The demo is ready below."
            : "The backend is awake. You can open the app now."
        }
      />

      {embed && (
        <div className="demoFrame">
          {ready ? (
            <iframe src={appUrl} title={frameTitle} loading="lazy" allow="clipboard-write" />
          ) : (
            <div className="demoPlaceholder">
              <p>The demo appears here as soon as the server is awake.</p>
            </div>
          )}
        </div>
      )}

      <div className="htTryActions">
        {canOpen ? (
          <a href={appUrl} target="_blank" rel="noopener noreferrer" className="btn btnPrimary">
            {openLabel}
            <span className="srOnly"> (opens in a new tab)</span>
          </a>
        ) : (
          <span className="btn btnPrimary" aria-disabled="true">
            {openLabel}
          </span>
        )}
        {extra && (
          <a href={extra.href} className="btn btnGhost">
            {extra.label}
          </a>
        )}
      </div>
    </div>
  );
}
