import React, { useState, useEffect } from 'react';

export default function GamePage({ onBack, sourceWords = [] }) {
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    
    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const res = await fetch('/api/word-questions');
          if (!res.ok) throw new Error('Асуултуудыг татаж чадсангүй');
          const base = await res.json();
          const pool = Array.isArray(sourceWords) && sourceWords.length ? sourceWords : base;
          const enriched = base.map((q) => {
            const correct = q.word;
            const candidates = pool.filter(w => (w.word || '') !== correct);
            const wrongs = candidates.sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
            const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
            return { ...q, options, correctAnswer: correct };
          });
          setQuestions(enriched);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchQuestions();
    }, [sourceWords]);

    const normalizeAnswer = (answer) => {
      return answer.toLowerCase().trim()
        .replace(/\s+/g, '')
        .replace(/[^a-zа-яөүё]/gi, '');
    };
  
    const handleQuizAnswer = (option) => {
      if (isAnswered) return;
      
      setSelectedOption(option);
      const current = questions[currentQuestion];
      const isCorrect = option === current.correctAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
        setFeedback({ type: 'success', message: '🎉 Зөв! Гайхалтай!' });
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      } else {
        setFeedback({ 
          type: 'error', 
          message: `❌ Буруу. Зөв хариулт: ${current.correctAnswer}` 
        });
      }
      
      setIsAnswered(true);
    };

    const handleTextSubmit = (e) => {
      e.preventDefault();
      if (!userAnswer.trim() || isAnswered) return;
      
      const normalized = normalizeAnswer(userAnswer);
      const current = questions[currentQuestion];
      
      const isCorrect = current.acceptedAnswers.some(ans => 
        normalizeAnswer(ans) === normalized
      );
      
      if (isCorrect) {
        setScore(score + 1);
        setFeedback({ type: 'success', message: '🎉 Зөв! Гайхалтай!' });
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      } else {
        setFeedback({ 
          type: 'error', 
          message: `❌ Буруу. Зөв хариулт: ${current.word}` 
        });
      }
      
      setIsAnswered(true);
    };

    const handleNext = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setSelectedOption(null);
        setFeedback(null);
        setIsAnswered(false);
      } else {
        setFeedback({
          type: 'final',
          message: `Тоглоом дууслаа! Таны оноо: ${score}/${questions.length}`
        });
      }
    };

    const handleRestart = () => {
      setCurrentQuestion(0);
      setScore(0);
      setUserAnswer('');
      setSelectedOption(null);
      setFeedback(null);
      setIsAnswered(false);
      setLoading(true);
      fetch('/api/word-questions')
        .then(res => res.json())
        .then(base => {
          const pool = Array.isArray(sourceWords) && sourceWords.length ? sourceWords : base;
          const enriched = base.map((q) => {
            const correct = q.word;
            const candidates = pool.filter(w => (w.word || '') !== correct);
            const wrongs = candidates.sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.word);
            const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
            return { ...q, options, correctAnswer: correct };
          });
          setQuestions(enriched);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
  
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative' }}>
        {showCelebration && (
          <>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'fixed',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  fontSize: '40px',
                  animation: 'celebration 2s ease-out forwards',
                  zIndex: 9999,
                  pointerEvents: 'none'
                }}
              >
                {['🎉', '⭐', '✨', '🏆', '🎊'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
            <style>
              {`
                @keyframes celebration {
                  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(-200px) rotate(360deg); opacity: 0; }
                }
              `}
            </style>
          </>
        )}

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
                  ← Буцах
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div style={{
          minHeight: 'calc(100vh - 80px)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '48px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '800px', width: '100%' }}>
            {loading ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>
                  Асуултууд бэлтгэж байна...
                </p>
              </div>
            ) : error ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                <p style={{ fontSize: '18px', color: '#ef4444', margin: 0 }}>
                  {error}
                </p>
              </div>
            ) : questions.length === 0 ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>
                  Асуулт олдсонгүй
                </p>
              </div>
            ) : feedback?.type === 'final' ? (
              // Төгсгөл
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
              }}>
                <div style={{ fontSize: '72px', marginBottom: '24px' }}>
                  {score === questions.length ? '🏆' : score >= questions.length / 2 ? '⭐' : '📚'}
                </div>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '16px'
                }}>
                  {score === questions.length ? 'Төгс!' : score >= questions.length / 2 ? 'Сайн!' : 'Дахин оролдоорой!'}
                </h2>
                <p style={{ fontSize: '24px', color: '#374151', marginBottom: '32px' }}>
                  Таны оноо: {score}/{questions.length}
                </p>
                <button
                  onClick={handleRestart}
                  style={{
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  🔄 Дахин тоглох
                </button>
              </div>
            ) : (
              // Асуулт
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                padding: '48px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
              }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '16px',
                      color: '#6b7280',
                      fontWeight: '600'
                    }}>
                      Асуулт {currentQuestion + 1}/{questions.length}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      background: questions[currentQuestion].type === 'quiz' 
                        ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                        : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: questions[currentQuestion].type === 'quiz' ? '#92400e' : '#1e40af'
                    }}>
                      {questions[currentQuestion].type === 'quiz' ? '📋 Quiz' : '✏️ Бичих'}
                    </span>
                  </div>
                  <div style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)',
                    borderRadius: '999px',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#9333ea'
                  }}>
                    ⭐ {score}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: '8px',
                  background: '#e9d5ff',
                  borderRadius: '999px',
                  marginBottom: '32px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    transition: 'width 0.5s ease'
                  }} />
                </div>

                {/* Image */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '220px',
                    height: '220px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: '-8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      opacity: 0.3
                    }} />
                    <div style={{
                      position: 'absolute',
                      inset: '-4px',
                      background: 'repeating-linear-gradient(45deg, #667eea 0px, #667eea 10px, #764ba2 10px, #764ba2 20px)',
                      borderRadius: '50%',
                      opacity: 0.5
                    }} />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: 'white',
                      padding: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
                    }}>
                      <img
                        src={questions[currentQuestion].image}
                        alt={questions[currentQuestion].word}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '4px solid #f3e8ff',
                          animation: isAnswered && feedback?.type === 'success' ? 'pulse 0.5s ease' : 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <style>
                  {`
                    @keyframes pulse {
                      0%, 100% { transform: scale(1); }
                      50% { transform: scale(1.1); }
                    }
                    @keyframes fadeIn {
                      from { opacity: 0; transform: translateY(-10px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}
                </style>

                {/* Question */}
                <div style={{
                  background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)',
                  padding: '28px',
                  borderRadius: '20px',
                  marginBottom: '28px',
                  border: '3px solid rgba(147, 51, 234, 0.2)'
                }}>
                  <div style={{ fontSize: '14px', color: '#9333ea', fontWeight: '600', marginBottom: '12px' }}>
                    📖 Энэ юу байх вэ?
                  </div>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0,
                    lineHeight: 1.6
                  }}>
                    {questions[currentQuestion].meaning}
                  </p>
                </div>

                {/* Answer section */}
                {questions[currentQuestion].type === 'quiz' ? (
                  // Quiz - Multiple choice
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px'
                    }}>
                      {questions[currentQuestion].options.map((option, idx) => {
                        const isSelected = selectedOption === option;
                        const isCorrect = option === questions[currentQuestion].correctAnswer;
                        const showResult = isAnswered;
                        
                        let bgColor = 'white';
                        let borderColor = '#e9d5ff';
                        
                        if (showResult) {
                          if (isCorrect) {
                            bgColor = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
                            borderColor = '#10b981';
                          } else if (isSelected && !isCorrect) {
                            bgColor = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
                            borderColor = '#ef4444';
                          }
                        }
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => handleQuizAnswer(option)}
                            disabled={isAnswered}
                            style={{
                              padding: '20px',
                              background: bgColor,
                              border: `3px solid ${borderColor}`,
                              borderRadius: '16px',
                              fontSize: '18px',
                              fontWeight: '600',
                              color: '#374151',
                              cursor: isAnswered ? 'default' : 'pointer',
                              transition: 'all 0.3s',
                              boxShadow: isSelected ? '0 8px 20px rgba(102, 126, 234, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseEnter={(e) => {
                              if (!isAnswered) {
                                e.currentTarget.style.background = 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)';
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.borderColor = '#9333ea';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isAnswered) {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = '#e9d5ff';
                              }
                            }}
                          >
                            {option}
                            {showResult && isCorrect && ' ✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Text - Type answer
                  <form onSubmit={handleTextSubmit}>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        💬 Энэ үгийг англиар бичээрэй:
                      </label>
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={isAnswered}
                        placeholder="Жишээ нь: Emeel"
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '18px',
                          border: feedback 
                            ? feedback.type === 'success' 
                              ? '3px solid #10b981' 
                              : '3px solid #ef4444'
                            : '2px solid #e9d5ff',
                          borderRadius: '16px',
                          outline: 'none',
                          transition: 'all 0.3s',
                          background: isAnswered ? '#f9fafb' : 'white',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </form>
                )}

                {/* Feedback */}
                {feedback && feedback.type !== 'final' && (
                  <div style={{
                    padding: '20px 24px',
                    borderRadius: '16px',
                    background: feedback.type === 'success' 
                      ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                      : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    marginBottom: '24px',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: feedback.type === 'success' ? '#065f46' : '#991b1b',
                    textAlign: 'center',
                    border: `3px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    {feedback.message}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {!isAnswered && questions[currentQuestion].type === 'text' ? (
                    <button
                      onClick={handleTextSubmit}
                      disabled={!userAnswer.trim()}
                      style={{
                        flex: 1,
                        padding: '16px',
                        background: userAnswer.trim() 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: userAnswer.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s',
                        boxShadow: userAnswer.trim() ? '0 6px 16px rgba(102, 126, 234, 0.4)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (userAnswer.trim()) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      ✓ Шалгах
                    </button>
                  ) : isAnswered ? (
                    <button
                      onClick={handleNext}
                      style={{
                        flex: 1,
                        padding: '16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {currentQuestion < questions.length - 1 ? '→ Дараах' : '🏁 Дуусгах'}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
