/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://api.justlay.me/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer lm-studio",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
          stream: false,
        }),
      });

      const data = await res.json();
      setResponse(data.choices?.[0]?.message?.content || "No response.");
    } catch (err: any) {
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Layme — Uncensored AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800&display=swap"
          rel="stylesheet"
        />
        <script defer data-domain="justlay.me" src="https://plausible.io/js/script.js"></script>
      </Head>

      <div className="relative w-screen h-screen flex flex-col items-center justify-end bg-black text-white font-playfair overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-[.85] saturate-[1.2] contrast-[1.05]"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        <div className="shark-fin-overlay" />

        <motion.div
          className="absolute top-[10%] text-6xl font-extrabold text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] z-10"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Layme
        </motion.div>

        <motion.div
          className="absolute bottom-32 max-w-[90%] text-white text-lg p-6 rounded-2xl backdrop-blur-xl bg-black/50 shadow-xl z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {loading ? (
            <div className="typing-dots flex gap-1">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            response
          )}
        </motion.div>

        <motion.div
          className="mb-10 flex gap-3 w-[90%] max-w-[650px] bg-black/70 p-4 rounded-2xl backdrop-blur-md z-10 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <input
            type="text"
            className="flex-1 p-4 rounded-md text-black text-base focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-white text-black px-5 py-3 rounded-md text-base font-semibold hover:bg-neutral-200 transition"
            onClick={sendMessage}
            disabled={loading}
          >
            ➤
          </button>
        </motion.div>
      </div>
    </>
  );
}
