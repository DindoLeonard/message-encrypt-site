"use client";

import { useEffect, useState } from "react";

export default function Message() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessage() {
      try {
        const messageResponse = await fetch("/api/message");
        if (!messageResponse.ok) {
          throw new Error("Failed to fetch the message.");
        }

        const data = await messageResponse.json();
        setMessage(data.message);
      } catch (_err) {
        console.log(_err);
        setMessage(null);
      }
    }

    fetchMessage();
  }, []);

  if (!message) {
    return <p className="text-white text-lg">Failed to load the message.</p>;
  }

  return (
    <div className="w-full max-w-3xl p-8 bg-gray-800 rounded shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-100 mb-6">
        Message
      </h1>
      <div
        className="text-gray-100 text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: message }}
      ></div>
    </div>
  );
}
