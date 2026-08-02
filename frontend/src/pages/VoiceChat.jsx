import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { transcribeAudio, generateSpeech } from '../services/voice';
import { sendMessage } from '../services/chat';
import { useTranslation } from 'react-i18next';

const VoiceChat = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const language = user?.preferred_language || 'English';
  
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioPlayerRef = useRef(null);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        audioChunks.current = [];
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    setLoading(true);
    try {
      // 1. Transcribe
      const transcription = await transcribeAudio(audioBlob);
      const userText = transcription.text;
      
      // Update UI with user message
      const newMessage = { sender: 'user', text: userText };
      setChatHistory(prev => [...prev, newMessage]);

      // 2. Get AI Response
      // Append a note to the message asking it to reply in the selected language to ensure it matches TTS
      const contextMessage = `${userText} (Please reply only in ${language})`;
      const chatResponse = await sendMessage(contextMessage, conversationId, language);
      
      if (!conversationId) {
        setConversationId(chatResponse.conversation_id);
      }
      
      const aiText = chatResponse.ai_message;
      
      // Update UI with AI message
      const newAiMessage = { sender: 'ai', text: aiText };
      setChatHistory(prev => [...prev, newAiMessage]);

      // 3. Convert AI Response to Speech
      const speechBlob = await generateSpeech(aiText, language);
      const url = URL.createObjectURL(speechBlob);
      
      // Revoke old URL to prevent memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(url);
      
      // Auto-play the audio
      if (audioPlayerRef.current) {
         // wait a tick for react to update the src
         setTimeout(() => {
             audioPlayerRef.current.play().catch(e => console.error("Playback failed:", e));
         }, 100);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during voice processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t('voice.title')}</h1>
        <p className="mt-3 text-xl text-gray-500 sm:mt-4">
          {t('voice.subtitle')}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              {isRecording ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-300"></span>
              )}
            </span>
            <span className="font-medium text-gray-700">
              {isRecording ? t('voice.listening') : (loading ? t('voice.processing') : t('voice.ready'))}
            </span>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-6">
          {chatHistory.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">{t('voice.tapMic')}</h2>
              </div> : (
            chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="p-3 mx-4 mt-4 bg-red-50 text-red-700 border border-red-200 rounded text-sm text-center">
            {error}
          </div>
        )}

        {/* Audio Player (Hidden visually, triggered programmatically) */}
        <audio ref={audioPlayerRef} src={audioUrl} className="hidden" controls />

        {/* Controls */}
        <div className="p-6 bg-white border-t border-gray-200 flex flex-col items-center justify-center">
          
          <div className="flex items-center space-x-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading}
              className={`relative group rounded-full p-6 transition-all duration-300 shadow-md flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-offset-2 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500 shadow-red-200' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 shadow-green-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? (
                 <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
              ) : (
                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
              )}
            </button>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600">
            {isRecording ? t('voice.tapToStop') : (loading ? t('voice.processing') : t('voice.tapToSpeak'))}
          </p>

          {audioUrl && !isRecording && !loading && (
            <button 
              onClick={() => audioPlayerRef.current?.play()}
              className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
              {t('voice.replay')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
