import React, { useState, useMemo } from 'react';
function GamePage({ onBack, sourceWords = [] }) {
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const questions = useMemo(() => {
      const items = Array.isArray(sourceWords) ? sourceWords.filter(w => w && w.word && w.meaning) : [];
      if (items.length === 0) return [];

      const pickDistractors = (idx, count) => {
        const pool = items.map((it, i) => ({ i, meaning: it.meaning })).filter(x => x.i !== idx);
        const result = [];
        const used = new Set();
        while (result.length < Math.min(count, pool.length)) {
          const r = Math.floor(Math.random() * pool.length);
          if (!used.has(r)) {
            used.add(r);
            result.push(pool[r].meaning);
          }
        }
        return result;
      };

      return items.map((it, idx) => {
        const distractors = pickDistractors(idx, 3);
        const opts = [it.meaning, ...distractors];
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        const correctIndex = opts.indexOf(it.meaning);
        return { word: it.word, image: it.image, options: opts, correct: correctIndex };
      });
    }, [sourceWords]);
  
    const handleAnswer = (selectedIndex) => {
      if (!questions.length) return;
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
          {/* <button
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
          </button> */}
  
          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0
              }}>Үг тоглуулах 🎮</h1>
              <div style={{ fontSize: '16px', color: '#6b7280' }}>
                Асуулт {questions.length ? currentQuestion + 1 : 0}/{questions.length} | Оноо: {score}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth >= 768 ? '1.2fr 0.8fr' : '1fr',
              gap: '24px',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#374151',
                  margin: '0 0 8px 0'
                }}>
                  {questions.length ? questions[currentQuestion].word : 'Асуулт алга'}
                </h2>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 16px 0' }}>
                  Энэ үгийг англиар орчуул:
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth >= 768 ? '1fr 1fr' : '1fr',
                  gap: '12px'
                }}>
                  {(questions[currentQuestion]?.options || []).map((option, index) => (
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
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'scale(1.03)';
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

              {questions.length && questions[currentQuestion].image ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={questions[currentQuestion].image}
                    alt={questions[currentQuestion].word}
                    style={{
                      width: window.innerWidth >= 768 ? '220px' : '180px',
                      height: window.innerWidth >= 768 ? '220px' : '180px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
export default GamePage;
  