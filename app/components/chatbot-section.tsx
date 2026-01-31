"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TranslationKey } from "../lib/i18n";
import { useLanguage } from "./language-provider";

type Message = {
  id: number;
  author: "user" | "bot";
  text: string;
};

const cannedReplies = [
  "Sure thing! Let me check that for you.",
  "I can help with any questions about your order.",
  "One sec while I connect you with the team.",
  "Thanks for reaching out! Anything else I can do?",
];

export default function ChatbotSection() {
  const { dir, lang, t } = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, author: "bot", text: t("talkWithUs") },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const botReply = useMemo(
    () => () => {
      const reply =
        cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, author: "bot", text: reply },
      ]);
    },
    [],
  );

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, author: "user", text },
    ]);
    setInputValue("");
    setTimeout(botReply, 400);
  };

  return (
    <section
      className="mx-auto my-10 max-w-5xl rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.12)]"
      dir={dir}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-orange-400">
            {t("talkWithUs")}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {t("support")}
          </h2>
        </div>
        <span className="rounded-full border border-orange-500 px-4 py-1 text-xs font-semibold text-orange-600">
          Chatbot
        </span>
      </div>

      <div className="mt-6 max-h-64 space-y-3 overflow-y-auto border-y border-slate-100 py-3 text-sm">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.author === "user" ? "justify-end" : ""
            }`}
          >
            <div
              className={`flex max-w-[70%] flex-col gap-1 rounded-2xl px-4 py-3 text-xs font-semibold ${
                message.author === "user"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-5 flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={t("send")}
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
        />
        <button
          type="button"
          onClick={handleSend}
          className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          {t("send")}
        </button>
      </div>
    </section>
  );
}
