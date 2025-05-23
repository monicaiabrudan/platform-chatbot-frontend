<<<<<<< HEAD
import PlatformChatbot from "../components/PlatformChatbot";
=======
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <Card className="p-4">
        <CardContent>
          <h2 className="text-xl font-semibold">Recommended Platform:</h2>
          <p className="mt-2 text-lg">{suggestion}</p>
        </CardContent>
      </Card>
    );
  }
>>>>>>> 991d01fab6123f124c69221dc97ed71ccce38c27

  return (
<<<<<<< HEAD
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <PlatformChatbot />
    </main>
=======
    <Card className="p-4 max-w-xl mx-auto mt-10">
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`text-${msg.role === 'user' ? 'right' : 'left'}`}>{msg.text}</div>
          ))}
          {messages.length === 0 && (
            <div className="text-left">{questions[0].label}</div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-2 py-1"
            placeholder="Your response..."
            onKeyDown={(e) => e.key === 'Enter' && handleUserInput()}
          />
          <Button onClick={handleUserInput}>Send</Button>
        </div>
      </CardContent>
    </Card>
>>>>>>> 991d01fab6123f124c69221dc97ed71ccce38c27
  );
}
