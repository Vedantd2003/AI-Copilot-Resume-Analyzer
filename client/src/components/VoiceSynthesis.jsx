import { useState, useEffect, useRef } from 'react';

const VoiceSynthesis = ({ text, onSpeakingChange, voiceType = 'professional' }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Select appropriate voice based on voiceType
        let voice = null;
        switch (voiceType) {
          case 'professional':
            voice = availableVoices.find(v => 
              v.name.includes('Microsoft') && 
              (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Guy'))
            ) || availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Male'));
            break;
          case 'friendly':
            voice = availableVoices.find(v => 
              v.name.includes('Samantha') || 
              v.name.includes('Karen') ||
              v.name.includes('Victoria')
            ) || availableVoices.find(v => v.lang.startsWith('en') && v.name.includes('Female'));
            break;
          case 'casual':
            voice = availableVoices.find(v => 
              v.name.includes('Alex') || 
              v.name.includes('Daniel')
            ) || availableVoices[0];
            break;
          default:
            voice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
        }
        
        setSelectedVoice(voice || availableVoices[0]);
      };

      loadVoices();
      
      // Voices load asynchronously in Chrome
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [voiceType]);

  const speak = async (textToSpeak) => {
    if (!isSupported || !selectedVoice || !textToSpeak) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    // Configure voice
    utterance.voice = selectedVoice;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = voiceType === 'friendly' ? 1.1 : voiceType === 'casual' ? 1.0 : 0.9;
    utterance.volume = 0.8;

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    }
  };

  // Auto-speak when text changes
  useEffect(() => {
    if (text && isSupported && selectedVoice) {
      // Small delay to ensure voice is loaded
      const timeout = setTimeout(() => {
        speak(text);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [text, isSupported, selectedVoice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isSupported,
    isSpeaking,
    speak,
    stop,
    voices,
    selectedVoice,
    changeVoice: setSelectedVoice
  };
};

export default VoiceSynthesis;
