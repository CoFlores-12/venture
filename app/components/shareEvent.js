import React, { useState, useRef, useEffect } from 'react';
import { FiShare2, FiLink, FiMail, FiFacebook, FiTwitter, FiX } from 'react-icons/fi';
import { FaWhatsapp  } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const ShareButton = ({ event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const menuRef = useRef(null);
  
  const eventUrl = `https://venture-navy.vercel.app/event/${event._id}`;
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const shareOnTwitter = () => {
    const text = `Mira este evento: ${event.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const shareOnWhatsApp = () => {
    const text = `Mira este evento: ${event.title} - ${eventUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareByEmail = () => {
    const subject = `Evento recomendado: ${event.title}`;
    const body = `Hola,\n\nTe recomiendo este evento: ${event.title}\n\nFecha: ${event.date}\nUbicación: ${event.location}\n\nMás información: ${eventUrl}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const nativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Evento: ${event.title} - ${event.date} en ${event.location}`,
        url: eventUrl
      }).catch(console.error);
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white bg-opacity-90 rounded-full dark:bg-slate-800 dark:text-gray-300 p-2 shadow-md  transition-colors"
        aria-label="Compartir evento"
      >
        {isCopied ? (
          <div className="w-5 h-5 flex items-center justify-center text-green-500">
            <FiCheck className="text-xl" />
          </div>
        ) : (
          <FiShare2 className="text-gray-800 text-xl dark:bg-slate-800 dark:text-gray-300" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-800 dark:text-gray-300 rounded-xl shadow-lg z-20 overflow-hidden">
          <div className="border-b border-gray-100 p-3 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 dark:bg-slate-800 dark:text-gray-300">Compartir evento</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <FiX className="text-gray-500" />
            </button>
          </div>
          
          <div className="p-2">
            <button
              onClick={nativeShare}
              className="w-full flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FiShare2 className="text-blue-600" />
              </div>
              <span>Compartir usando...</span>
            </button>
            
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                <FiLink className="text-gray-600" />
              </div>
              <span>Copiar enlace</span>
            </button>
            
            <button
              onClick={shareByEmail}
              className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 text-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <FiMail className="text-red-600" />
              </div>
              <span>Compartir por correo</span>
            </button>
          </div>
          
          <div className="border-t border-gray-100 p-3">
            <h4 className="text-xs text-gray-500 uppercase mb-2">Compartir en redes</h4>
            <div className="flex space-x-3">
              <button
                onClick={shareOnFacebook}
                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                aria-label="Compartir en Facebook"
              >
                <FiFacebook className="text-xl" />
              </button>
              
              <button
                onClick={shareOnTwitter}
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
                aria-label="Compartir en X"
              >
                <FaXTwitter  className="text-xl" />
              </button>
              
              <button
                onClick={shareOnWhatsApp}
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                aria-label="Compartir en WhatsApp"
              >
                <FaWhatsapp className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FiCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default ShareButton;