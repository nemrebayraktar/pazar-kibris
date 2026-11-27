import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Zap, Car } from 'lucide-react';
import { processUserMessage } from '../services/aiChatService';
import type { Vehicle } from '../types';
import VehicleDetailModal from './VehicleDetailModal';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  vehicles?: Vehicle[];
  suggestions?: string[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! 👋 Ben KartalBot Alpha. Size araç bulmanızda yardımcı olabilirim!\n\nÖrneğin şunları sorabilirsiniz:\n• "Yakıt cimrisi araç istiyorum"\n• "Aile arabası lazım"\n• "Yüksek araç göster"\n• "Şehir içi kullanım için küçük araç"\n• "Uzun yol için konforlu araç"',
      sender: 'bot',
      timestamp: new Date(),
      suggestions: ['Yakıt cimrisi araç', 'Aile arabası', 'Yüksek araç göster', 'Şehir içi araç']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const response = await processUserMessage(currentMessage);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        vehicles: response.vehicles,
        suggestions: response.suggestions,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    'Yakıt cimrisi araç istiyorum',
    'Aile arabası lazım',
    'Yüksek araç göster',
    'Şehir içi için küçük araç'
  ];

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailModalOpen(true);
  };

  return (
    <>
      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedVehicle(null);
        }}
      />

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 text-white p-5 rounded-full shadow-2xl hover:shadow-cyan-400/50 transition-all transform hover:scale-110 z-50 group hover:rotate-12"
        >
          <Bot className="h-8 w-8" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-teal-300 opacity-0 group-hover:opacity-30 transition-opacity blur-xl animate-pulse"></div>
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
            <Zap className="h-3 w-3" />
          </span>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-2xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl font-medium border-2 border-white/30">
            <Bot className="h-4 w-4 inline mr-2" />
            Benimle konuşmak ister misin?
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-cyan-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 text-white p-5 flex items-center justify-between rounded-t-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-300 opacity-20"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="bg-white/30 backdrop-blur-sm p-3 rounded-2xl border-2 border-white/50 shadow-lg">
                <Bot className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center">
                  KartalBot Alpha
                  <span className="ml-2 text-xl">🦅</span>
                </h3>
                <p className="text-xs text-white/90 flex items-center">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse shadow-lg"></span>
                  Aktif ve hazır
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-xl transition-all relative z-10 hover:rotate-90 transform duration-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-cyan-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex items-start space-x-2 max-w-[90%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 ${message.sender === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-cyan-500 via-teal-400 to-emerald-400'} rounded-full p-2.5 shadow-lg border-2 border-white`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none shadow-lg'
                          : 'bg-white text-gray-800 border-2 border-cyan-100 rounded-tl-none shadow-md hover:shadow-lg transition-all hover:border-cyan-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    </div>

                    {message.vehicles && message.vehicles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.vehicles.slice(0, 3).map((vehicle) => (
                          <div
                            key={vehicle.id}
                            onClick={() => handleVehicleClick(vehicle)}
                            className="bg-white border-2 border-cyan-100 rounded-xl p-3 hover:shadow-lg transition-all hover:border-cyan-300 cursor-pointer"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg p-2">
                                <Car className="h-5 w-5 text-cyan-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 truncate">
                                  {vehicle.brand} {vehicle.model}
                                </h4>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  {vehicle.year} • {vehicle.fuel} • {vehicle.gearbox}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-cyan-600 font-bold text-sm">
                                    {vehicle.price.toLocaleString('tr-TR')} {vehicle.currency}
                                  </span>
                                  <span className="text-xs text-gray-500">📍 {vehicle.city}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {message.vehicles.length > 3 && (
                          <p className="text-xs text-center text-gray-500 mt-2">
                            +{message.vehicles.length - 3} araç daha
                          </p>
                        )}
                      </div>
                    )}

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInputText(suggestion)}
                            className="text-xs bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-lg px-3 py-1.5 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 hover:border-cyan-300 transition-all"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-1 px-1 flex items-center">
                      {message.sender === 'bot' && <span className="mr-1">🤖</span>}
                      {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="flex-shrink-0 bg-gradient-to-br from-cyan-500 via-teal-400 to-emerald-400 rounded-full p-2.5 shadow-lg border-2 border-white">
                    <Bot className="h-4 w-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-white border-2 border-cyan-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Düşünüyorum</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="px-4 pb-3 space-y-2 bg-gradient-to-b from-cyan-50 to-white border-t-2 border-cyan-100">
              <p className="text-xs text-gray-600 font-semibold flex items-center">
                <span className="mr-1.5">💡</span>
                Bunları sorabilirsin:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(question)}
                    className="text-left text-xs bg-white border-2 border-cyan-100 rounded-xl px-3 py-2.5 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:border-cyan-300 transition-all text-gray-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <span className="mr-1">🤖</span>
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-cyan-100 bg-white">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ne tür araç arıyorsunuz? 🚗"
                className="flex-1 px-4 py-3 border-2 border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm shadow-sm"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-gradient-to-br from-cyan-500 via-teal-400 to-emerald-400 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2.5 text-center flex items-center justify-center">
              <Bot className="h-3 w-3 mr-1.5 text-cyan-400" />
              AI destekli araç arama asistanı
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
