import React, { useState, useEffect } from 'react';

export default function GamePage({ onBack }) {
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const res = await fetch('/api/game-questions');
          if (!res.ok) throw new Error('Асуултуудыг татаж чадсангүй');
          const data = await res.json();
          setQuestions(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchQuestions();
    }, []);
  
    const handleAnswer = (selectedIndex) => {
      if (!questions || questions.length === 0) return;
      
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
      }
    };
  
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
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

              {/* Navigation */}
              <nav style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={onBack}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: 'transparent',
                    color: '#374151'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3e8ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Home
                </button>
                <button
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  Game
                </button>
                <button
                  onClick={onBack}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: 'transparent',
                    color: '#374151'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3e8ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Culture
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div style={{
          minHeight: 'calc(100vh - 80px)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px 20px'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              textAlign: 'center'
            }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: '0 0 16px 0'
              }}>
                Үг тоглуулах 🎮
              </h1>
              
              {loading ? (
                <div style={{ fontSize: '18px', color: '#6b7280', padding: '40px' }}>
                  Асуултууд ачааллаж байна...
                </div>
              ) : error ? (
                <div style={{ fontSize: '18px', color: '#ef4444', padding: '40px' }}>
                  Алдаа: {error}
                </div>
              ) : questions.length === 0 ? (
                <div style={{ fontSize: '18px', color: '#6b7280', padding: '40px' }}>
                  Асуулт олдсонгүй. Backend дээр асуулт нэмнэ үү.
                </div>
              ) : (
                <>
                  <div style={{
                    fontSize: '18px',
                    color: '#6b7280',
                    marginBottom: '32px'
                  }}>
                    Асуулт {currentQuestion + 1}/{questions.length} | Оноо: {score}
                  </div>
        
                  <div style={{
                    background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)',
                    padding: '32px',
                    borderRadius: '16px',
                    marginBottom: '32px'
                  }}>
                    <h2 style={{
                      fontSize: '36px',
                      fontWeight: '700',
                      color: '#374151',
                      margin: '0 0 16px 0'
                    }}>
                      {questions[currentQuestion].word}
                    </h2>
                    <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>
                      Энэ үгийг англиар орчуул:
                    </p>
                  </div>
        
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        style={{
                          padding: '24px',
                          background: 'white',
                          border: '2px solid #e9d5ff',
                          borderRadius: '16px',
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#374151',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.color = '#374151';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.borderColor = '#e9d5ff';
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
