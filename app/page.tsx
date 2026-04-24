'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import Markdown from 'react-markdown';

type Message = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', parts: [{ text: input }] }
    ];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la conexión dimensional');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: data.text }] }
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { 
          role: 'model', 
          // Mensaje integrado en la narrativa si hay un fallo
          parts: [{ text: error.message || 'Interferencias en la red temporalmente... ¡Mi tambor dimensional se ha atascado y no consigo recuperar la señal!' }] 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFCF6] text-zinc-900 font-sans overflow-hidden border-[12px] border-zinc-900">
      {/* Header Temático */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-orange-400 border-b-[6px] border-zinc-900 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border-4 border-zinc-900 rounded-full flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            🧦
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none">
              Crono-Calcetín
            </h1>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Explorador de Conocimiento del Medio</p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span className="bg-zinc-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-2">Gemma-4-26b-A4B-IT</span>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 bg-green-500 border-2 border-zinc-900 rounded-full"></span>
            <span className="text-xs font-bold uppercase tracking-tight italic">Conectado a la Tubería Temporal</span>
          </div>
        </div>
      </header>

      {/* Área de Chat */}
      <main className="flex-1 overflow-y-auto w-full flex flex-col p-4 sm:p-8 bg-[#FDFCF6]">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 text-zinc-900 animate-in zoom-in-95 duration-500 py-12">
              <div className="bg-white border-4 border-zinc-900 p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xl w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Iniciando Sistema</p>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">¡Bienvenido a la lavadora dimensional!</h2>
                <p className="font-bold text-sm leading-relaxed border-l-4 border-orange-400 pl-4 text-left">
                  Soy Crono-Calcetín. ¿Listo para viajar por la Historia, explorar la Naturaleza o descubrir cómo funciona nuestro mundo?
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-6">
                <button 
                  onClick={() => handleSuggestion("¿Cómo vivían en la Antigua Roma?")}
                  className="p-4 border-4 border-zinc-900 bg-white hover:bg-orange-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] font-bold uppercase text-xs flex items-center gap-3 text-left"
                >
                  <span className="text-xl">🏛️</span>
                  <span>¿Cómo vivían en la Antigua Roma?</span>
                </button>
                <button 
                  onClick={() => handleSuggestion("Explícame el ciclo del agua")}
                  className="p-4 border-4 border-zinc-900 bg-white hover:bg-orange-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] font-bold uppercase text-xs flex items-center gap-3 text-left"
                >
                  <span className="text-xl">💧</span>
                  <span>Explícame el ciclo del agua</span>
                </button>
                <button 
                  onClick={() => handleSuggestion("¿Por qué tenemos estaciones del año?")}
                  className="p-4 border-4 border-zinc-900 bg-white hover:bg-orange-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] font-bold uppercase text-xs flex items-center gap-3 text-left"
                >
                  <span className="text-xl">🍂</span>
                  <span>¿Por qué tenemos estaciones?</span>
                </button>
                <button 
                  onClick={() => handleSuggestion("Háblame del cuerpo humano")}
                  className="p-4 border-4 border-zinc-900 bg-white hover:bg-orange-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] font-bold uppercase text-xs flex items-center gap-3 text-left"
                >
                  <span className="text-xl">🫀</span>
                  <span>Descubre el cuerpo humano</span>
                </button>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
             <div 
             key={idx} 
             className={`flex items-start gap-4 max-w-[95%] sm:max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 ${
               msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
             }`}
           >
             <div className={`w-10 h-10 border-2 border-zinc-900 flex items-center justify-center text-xl shrink-0 font-black ${
                 msg.role === 'user' 
                   ? 'bg-blue-500 text-white' 
                   : 'bg-orange-400'
               }`}
             >
               {msg.role === 'user' ? 'U' : '🧦'}
             </div>
             
             <div 
               className={`p-4 sm:p-5 border-4 border-zinc-900 ${
                 msg.role === 'user' 
                   ? 'bg-blue-600 text-white shadow-[-6px_6px_0px_0px_rgba(30,58,138,1)]' 
                   : 'bg-white shadow-[6px_6px_0px_0px_rgba(251,146,60,1)]'
               }`}
             >
               <div className={`prose prose-zinc max-w-none ${
                 msg.role === 'user' 
                   ? 'prose-invert prose-p:leading-relaxed' 
                   : 'prose-p:leading-relaxed prose-li:my-1 prose-headings:mb-2 prose-headings:mt-4 text-zinc-900 border-zinc-900'
               }`}>
                 {msg.role === 'user' ? (
                   <p className="whitespace-pre-wrap m-0 font-bold text-sm">{msg.parts[0].text}</p>
                 ) : (
                   <div className="markdown-body font-medium text-[14px] sm:text-[15px]">
                     <Markdown>{msg.parts[0].text}</Markdown>
                   </div>
                 )}
               </div>
             </div>
           </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-3 opacity-60 mt-2 mb-6">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest italic">Crono-Calcetín está revolviendo su tambor...</span>
            </div>
          )}
          {/* Ref para auto-scroll */}
          <div ref={messagesEndRef} className="h-4 sm:h-8 shrink-0" />
        </div>
      </main>

      {/* Footer / Input */}
      <footer className="shrink-0 flex flex-col z-10">
        <div className="p-4 sm:p-8 border-t-[6px] border-zinc-900 bg-white flex flex-col sm:flex-row gap-4 items-center w-full">
          <div className="flex-1 border-4 border-zinc-900 p-2 sm:p-4 flex items-center bg-white w-full">
            <span className="text-zinc-400 font-bold mr-2 uppercase text-xs hidden sm:inline">Responder:</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Escribe aquí tu teoría dimensional..."
              className="w-full bg-transparent outline-none text-sm font-bold placeholder-zinc-400 disabled:opacity-50"
            />
          </div>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="w-full sm:w-auto h-[60px] px-8 bg-zinc-900 text-white font-black uppercase tracking-widest hover:bg-orange-400 hover:text-zinc-900 transition-colors border-l-4 border-t-4 border-white active:translate-y-1 disabled:opacity-50 disabled:hover:bg-zinc-900 disabled:hover:text-white shrink-0 cursor-pointer"
          >
            Enviar ➔
          </button>
        </div>
        <div className="bg-zinc-900 text-white px-4 sm:px-8 py-2 flex justify-between items-center text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] overflow-hidden">
          <span className="truncate mr-4">Versión 2.0.4 - Proto-Tejido</span>
          <span className="hidden md:inline truncate mr-4">Sin fugas de API Keys en el motor de vapor</span>
          <span className="shrink-0">© 2024 Lab. Dimensionales</span>
        </div>
      </footer>
    </div>
  );
}
