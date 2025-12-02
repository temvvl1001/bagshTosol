import React, { useState } from 'react';
import GamePage from '/Users/butentemvvlentem/Bagshnar /my-app/src/game.jsx';  

export default function DictionaryApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [messages, setMessages] = useState([
    { text: 'Сайн байна уу! Би танд үг тайлбарлах, жишээ өгөх асуудлаар туслах бэлэн байна. 😊', isUser: false }
  ]);

  const tabs = ['Home', 'Game', 'Culture', 'Writing tips'];

  const wordCards = [
    {
      word: 'Emeel',
      pronunciation: 'Эмээл',
      date: 'NOVEMBER 30, 2025',
      image: "/emeel.png"
    },
    {
      word: 'regnant',
      pronunciation: 'reg-nuhnt',
      date: 'NOVEMBER 30, 2025',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop'
    },
    {
      word: 'regnant',
      pronunciation: 'reg-nuhnt',
      date: 'NOVEMBER 30, 2025',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop'
    }
  ];

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([...messages, 
        { text: chatMessage, isUser: true },
        { text: 'Таны асуултыг ойлгож байна. Би танд тусалж чадна! 🎯', isUser: false }
      ]);
      setChatMessage('');
    }
  };

  // Хэрэв Game хуудас бол GamePage харуулах
  if (currentPage === 'game') {
    return <GamePage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid rgba(147, 51, 234, 0.2)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            height: '80px',
            flexWrap: 'wrap'
          }}>
            
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>LEXICON</h1>
            </div>

            {/* Search Bar - Desktop */}
            <div style={{ 
              display: window.innerWidth >= 768 ? 'flex' : 'none',
              flex: 1,
              maxWidth: '600px',
              margin: '0 32px',
              position: 'relative'
            }}>
              <input
                type="text"
                placeholder="Үг эсвэл хэллэг хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  borderRadius: '16px',
                  border: '2px solid #e9d5ff',
                  outline: 'none',
                  fontSize: '16px',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
              />
              <svg style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9333ea'
              }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            {/* Navigation - Desktop */}
            <nav style={{ 
              display: window.innerWidth >= 768 ? 'flex' : 'none',
              gap: '8px'
            }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    if (tab === 'Game') {
                      setCurrentPage('game');
                    } else {
                      setActiveTab(tab);
                    }
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: activeTab === tab 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: activeTab === tab ? 'white' : '#374151',
                    boxShadow: activeTab === tab ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab) {
                      e.currentTarget.style.backgroundColor = '#f3e8ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: window.innerWidth < 768 ? 'block' : 'none',
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Үг эсвэл хэллэг хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #e9d5ff',
                  outline: 'none'
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    if (tab === 'Game') {
                      setCurrentPage('game');
                    } else {
                      setActiveTab(tab);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: activeTab === tab 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#f3e8ff',
                    color: activeTab === tab ? 'white' : '#374151'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr',
          gap: '32px'
        }}>
          
          {/* Word Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {wordCards.map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  border: '1px solid rgba(147, 51, 234, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ 
                  display: 'flex',
                  flexDirection: window.innerWidth >= 768 ? 'row' : 'column',
                  gap: '24px',
                  alignItems: window.innerWidth >= 768 ? 'center' : 'flex-start'
                }}>
                  {/* Word Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '700',
                        borderRadius: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        WORD OF THE DAY
                      </span>
                      <span style={{ fontSize: '16px' }}>✨</span>
                    </div>
                    
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                      {item.date}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <h2 style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: 0
                      }}>
                        {item.word}
                      </h2>
                      <button style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#f3e8ff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e9d5ff';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f3e8ff';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      >
                        <svg width="20" height="20" fill="none" stroke="#9333ea" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                        </svg>
                      </button>
                    </div>
                    
                    <p style={{ 
                      fontFamily: 'monospace',
                      fontSize: '18px',
                      color: '#6b7280',
                      marginBottom: '16px'
                    }}>
                      [{item.pronunciation}]
                    </p>
                    
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#9333ea',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ec4899'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9333ea'}
                    >
                      Meaning and examples →
                    </button>
                  </div>

                  {/* Image */}
                  <div style={{ position: 'relative', width: '192px', height: '192px' }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '16px',
                      transform: 'rotate(3deg)',
                      transition: 'transform 0.3s'
                    }}></div>
                    <img
                      src={item.image}
                      alt={item.word}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        transition: 'transform 0.3s'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chatbot */}
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: '100px',
              border: '1px solid rgba(147, 51, 234, 0.1)'
            }}>
              {/* Chat Header */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '24px' }}>✨</span>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>AI Туслах</h3>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Таны хэлний хамтрагч</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{
                height: '400px',
                overflowY: 'auto',
                padding: '24px',
                background: 'linear-gradient(to bottom, rgba(243, 232, 255, 0.3), rgba(251, 207, 232, 0.3))',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      maxWidth: '80%',
                      alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                      background: msg.isUser 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'white',
                      color: msg.isUser ? 'white' : '#374151',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: msg.isUser ? 'none' : '1px solid rgba(147, 51, 234, 0.1)'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div style={{
                padding: '16px',
                background: 'white',
                borderTop: '1px solid rgba(147, 51, 234, 0.1)'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Асуулт асуух..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '2px solid #e9d5ff',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                    onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
                  />
                  <button
                    onClick={sendMessage}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}