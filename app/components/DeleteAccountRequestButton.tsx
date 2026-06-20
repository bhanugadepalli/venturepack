"use client";

import { useState } from "react";

export function DeleteAccountRequestButton() {
  const [requested, setRequested] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setRequested(true)}
        className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        Delete account request
      </button>
      {requested ? (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          Request noted for this MVP. Account deletion will later include a recovery period and backup expiration
          schedule.
        </p>
      ) : null}
    </div>
  );
}
