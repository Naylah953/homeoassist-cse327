import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

// Preset Q&As for instant helpful answers
const PRESET_FAQS = [
  {
    q: "What is HomeoAssist?",
    a: "HomeoAssist is a specialized digital platform connecting patients with certified homeopathic practitioners, offering online consultations, AI symptom assistance, and remedy management."
  },
  {
    q: "How do I book a doctor?",
    a: "You can search for doctors by specialty, qualification, or fee in our directory. Click 'Book Consultation' on any profile to schedule your appointment."
  },
  {
    q: "Are the doctors verified?",
    a: "Yes! All homeopathic doctors on our platform are verified using their registration numbers and qualifications before listing."
  },
  {
    q: "Is AI Symptom Chat a real doctor?",
    a: "No, our AI tool provides instant preliminary symptom guidance and homeo-remedy insights, but it is meant to complement—not replace—a full doctor consultation."
  }
];

export const HomeBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! 👋 Welcome to HomeoAssist. How can I help you learn more about our platform today?'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Simulate bot response logic
    setTimeout(() => {
      let replyText = "Thanks for asking! HomeoAssist helps you connect with qualified homeopathic doctors, manage digital prescriptions, and analyze symptoms using AI tools. Check out our directory or sign up to get started!";
      
      const lowerQuery = query.toLowerCase();
      
      // Match against basic keywords or FAQs
      const matchedFaq = PRESET_FAQS.find(faq => 
        lowerQuery.includes(faq.q.toLowerCase().slice(0, 10))
      );

      if (matchedFaq) {
        replyText = matchedFaq.a;
      } else if (lowerQuery.includes('doctor') || lowerQuery.includes('consult')) {
        replyText = "You can browse verified homeopaths under our 'Find Doctor' directory and book an online consultation directly.";
      } else if (lowerQuery.includes('price') || lowerQuery.includes('fee') || lowerQuery.includes('cost')) {
        replyText = "Consultation fees vary by doctor and are clearly listed on each practitioner's profile.";
      } else if (lowerQuery.includes('ai') || lowerQuery.includes('chat') || lowerQuery.includes('symptom')) {
        replyText = "Our AI Symptom Assistant helps patients quickly understand potential homeopathic remedies before booking a visit.";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#2E5B44] hover:bg-[#234E3B] text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105"
          aria-label="Open support chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Box Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl border border-[#d6d0c8] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#2E5B44] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#3D7156] flex items-center justify-center text-sm font-bold border border-[#528A6D]">
                HA
              </div>
              <div>
                <h3 className="font-serif font-bold text-base leading-tight">HomeoAssist Guide</h3>
                <p className="text-xs text-emerald-100/80">Ask us anything about our platform</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#F4F1EA]/50 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#2E5B44] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-[#e6e2d8] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Chips */}
          <div className="px-3 py-2 bg-[#F4F1EA] border-t border-[#d6d0c8] flex gap-2 overflow-x-auto no-scrollbar">
            {PRESET_FAQS.map((faq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(faq.q)}
                className="text-xs bg-white text-[#2E5B44] hover:bg-[#2E5B44] hover:text-white px-2.5 py-1 rounded-full border border-[#d6d0c8] whitespace-nowrap transition-colors flex-shrink-0"
              >
                {faq.q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#d6d0c8] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-[#F4F1EA] border border-[#e6e2d8] rounded-xl px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2E5B44]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-[#2E5B44] text-white p-2 rounded-xl disabled:opacity-40 hover:bg-[#234E3B] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>

        </div>
      )}
    </div>
  );
};