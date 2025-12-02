import React, { useState } from 'react';
function GamePage({ onBack }) {
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    
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
      }
    };
  
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '32px 20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#667eea',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            ← Буцах
          </button>
  
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
          </div>
        </div>
      </div>
    );
  }
  