"use client";

import { useState } from 'react';

export default function PlatformChatbot() {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [suggestion, setSuggestion] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://platform-suggestion-api.onrender.com";

  const questions = [
    { key: 'online_onsite', label: 'Is your course online, onsite, or hybrid?' },
    { key: 'dependency_issues', label: 'Any dependency issues? (no issues, minor issues, major issues)' },
    { key: 'setup_time', label: 'How long is setup time? (no setup, fast, moderate, slow)' },
    { key: 'training_data_access', label: 'Is the training data accessible publicly? (all, some, none)' },
    { key: 'need_software_installed', label: 'Does your course need software installed?', type: 'boolean' },
    { key: 'is_computer_mandatory', label: 'Is a computer mandatory?', type: 'boolean' },
    { key: 'is_discussion_based', label: 'Is your course mostly discussion-based?', type: 'boolean' },
    { key: 'min_computer_specs_met', label: 'Do computers meet minimum specs (8GB RAM, i5, 100GB)?', type: 'boolean' },
    { key: 'can_share_vm_at_scale', label: 'Can you share VMs at the required scale?', type: 'boolean' }
  ];

  const current = questions[step];

  const handleUserInput = () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    const key = current.key;
    const value = current.type === 'boolean' ? userMessage.toLowerCase() === 'yes' : userMessage;

    setMessages([...messages, { role: 'user', text: userMessage }]);
    setFormData({ ...formData, [key]: value });
    setInputValue("");

    if (step < questions.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'bot', text: questions[nextStep].label }]);
      }, 300);
    } else {
      fetch(`${API_URL}/suggest_platform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, [key]: value })
      })
        .then(res => res.json())
        .then(data => setSuggestion(data.suggested_platform))
        .catch(err => console.error("Error:", err));
    }
  };

  if (suggestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="rounded-xl p-6 bg-white shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-pink-800">Recommended Platform</h2>
          <p className="mt-4 text-lg text-pink-700">{suggestion}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="p-6 max-w-xl w-full rounded-xl bg-white shadow space-y-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`rounded-xl px-4 py-2 max-w-[80%] w-fit ${
                msg.role === 'user' ? 'ml-auto bg-pink-200 text-right' : 'mr-auto bg-pink-100 text-left'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-left text-pink-800">{questions[0].label}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 border border-pink-300 rounded px-3 py-2 bg-white shadow-sm"
            placeholder="Your response..."
            onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
          />
          <button
            onClick={handleUserInput}
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 shadow"
          >
            💬 Send
          </button>
        </div>
      </div>
    </div>
  );
}