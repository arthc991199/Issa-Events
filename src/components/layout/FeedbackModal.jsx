// src/components/layout/FeedbackModal.jsx
import React, { useState } from 'react';
import { X, Send, Loader } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, teamColor }) => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    const mailtoLink = `mailto:aleks.konopacki@issa.org.pl?subject=Propozycja zmian w aplikacji ISSA Events&body=Proponowana zmiana:%0D%0A${encodeURIComponent(feedback)}%0D%0A%0D%0AEmail kontaktowy:%0D%0A${encodeURIComponent(email)}`;
    
    window.location.href = mailtoLink;
    
    // Reset formularza
    setFeedback('');
    setEmail('');
    setIsSending(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md bg-black border border-${teamColor}-500/30 
                    rounded-lg shadow-lg z-50 p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-${teamColor}-400 text-xl font-bold font-mono`}>
            Zaproponuj Zmianę
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="feedback" 
              className="block text-sm font-mono mb-2 text-gray-300"
            >
              Opisz proponowaną zmianę:
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={`w-full h-32 px-3 py-2 bg-black border border-${teamColor}-500/30 
                       rounded-md focus:outline-none focus:border-${teamColor}-500 
                       text-white font-mono resize-none`}
              placeholder="Co chciałbyś zmienić w aplikacji?"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-mono mb-2 text-gray-300"
            >
              Twój email (opcjonalnie):
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 bg-black border border-${teamColor}-500/30 
                       rounded-md focus:outline-none focus:border-${teamColor}-500 
                       text-white font-mono`}
              placeholder="jan.kowalski@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSending || !feedback.trim()}
            className={`w-full py-2 px-4 rounded font-mono
                     border border-${teamColor}-500
                     hover:bg-${teamColor}-500 hover:text-black
                     transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2`}
          >
            {isSending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Wyślij Propozycję
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;