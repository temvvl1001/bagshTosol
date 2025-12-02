import React, { useState } from 'react';

export default function GamePage({ onBack }) {
  const [activeGameTab, setActiveGameTab] = useState('Games');
  const [searchQuery, setSearchQuery] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const gameTabs = ['Home', 'Game', 'Culture', 'Writing tips'];

  const questions = [
    {
      word: 'Сайн байна уу?',
      options: ['Hello', 'Goodbye', 'Thank you', 'Welcome'],
      correct: 0
    },
    {
      word: 'Баярлалаа',
      options: ['Sorry', 'Please', 'Thank you', 'Yes'],
      correct: 2
    },
    {
      word: 'Тийм',
      options: ['No', 'Yes', 'Maybe', 'Never'],
      correct: 1
    },
    {
      word: 'Уучлаарай',
      options: ['Hello', 'Sorry', 'Goodbye', 'Welcome'],
      correct: 1
    }
  ];

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
      alert('Зөв! ✅');
    } else {
      alert('Буруу ❌');
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`Тоглоом дууслаа! Таны оноо: ${score + (selectedIndex === questions[currentQuestion].correct ? 1 : 0)}/${questions.length}`);
      setCurrentQuestion(0);
      setScore(0);
      setGameStarted(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCurrentQuestion(0);
  };

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
            height: '80px'
          }}>
            
            {/* Logo with Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={onBack}
                style={{
                  padding: '8px 16px',
                  background: '#f3e8ff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  color: '#667eea',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#e9d5ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f3e8ff'}
              >
                ← Буцах
              </button>
              
              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0
              }}>GAME</h1>
            </div>

            {/* Search Bar */}
            <div style={{ 
              flex: 1,
              maxWidth: '500px',
              margin: '0 32px',
              position: 'relative'
            }}>
              <input
                type="text"
                placeholder="Search a word or phrase..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 40px',
                  borderRadius: '20px',
                  border: '2px solid #e9d5ff',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#9333ea'}
                onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
              />
              <svg style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9333ea'
              }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            {/* Navigation Tabs */}
            <nav style={{ display: 'flex', gap: '8px' }}>
              {gameTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveGameTab(tab)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: activeGameTab === tab 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: activeGameTab === tab ? 'white' : '#374151',
                    fontSize: '14px',
                    boxShadow: activeGameTab === tab ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (activeGameTab !== tab) {
                      e.currentTarget.style.backgroundColor = '#f3e8ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeGameTab !== tab) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }}>
          
          {/* Game Area */}
          <div style={{
            background: 'rgba(173, 216, 230, 0.4)',
            borderRadius: '16px',
            padding: '32px',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {!gameStarted ? (
              <>
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: 'rgba(135, 206, 250, 0.5)',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  🎮
                </div>
                
                <button
                  onClick={startGame}
                  style={{
                    padding: '16px 80px',
                    background: 'rgba(135, 206, 250, 0.8)',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    color: '#1e40af',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(135, 206, 250, 1)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(135, 206, 250, 0.8)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  start game
                </button>
              </>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '32px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Асуулт {currentQuestion + 1}/{questions.length}</span>
                    <span>Оноо: {score}</span>
                  </div>
                  
                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>
                    {questions[currentQuestion].word}
                  </h2>
                  
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#6b7280', 
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>
                    Энэ үгийг англиар орчуул:
                  </p>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        style={{
                          padding: '16px',
                          background: 'white',
                          border: '2px solid #e9d5ff',
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.borderColor = '#e9d5ff';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Sidebar */}
          <div style={{
            background: 'rgba(173, 216, 230, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 'fit-content'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: 'rgba(169, 169, 169, 0.4)',
              borderRadius: '50%',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="60" height="60" fill="rgba(169, 169, 169, 0.8)" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              margin: 0
            }}>
              name
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}