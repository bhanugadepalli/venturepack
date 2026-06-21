"use client";

import { useState } from "react";

import { Button, Card } from "../components/ui";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#DCE7F3] bg-white px-4 py-3 text-sm text-[#00173C] outline-none transition focus:border-[#009EA7] focus:ring-4 focus:ring-[rgba(0,158,167,0.16)]";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="shadow-xl shadow-[#00173C]/8">
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <div>
          <label className="text-sm font-semibold text-[#00173C]" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#00173C]" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-sm font-semibold text-[#00173C]" htmlFor="audience">
            I am a...
          </label>
          <select id="audience" name="audience" className={inputClass} defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option>Founder</option>
            <option>Accelerator or cohort leader</option>
            <option>Attorney</option>
            <option>Student or educator</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-[#00173C]" htmlFor="message">
            Message
          </label>
          <textarea id="message" name="message" rows={5} className={inputClass} placeholder="Tell us what you are working on." />
        </div>
        {submitted ? (
          <div className="rounded-2xl border border-[#DCE7F3] bg-[rgba(0,158,167,0.10)] p-4 text-sm font-semibold text-[#008787]">
            Contact handling is coming soon. Thanks for reaching out.
          </div>
        ) : null}
        <Button type="submit" className="w-full">
          Send message
        </Button>
      </form>
    </Card>
  );
}
