
import React, { useState, useEffect } from 'react';
import GamePage from './game.jsx';
import HomePage from './Home.jsx';
import CulturePage from './Culture.jsx';

export default function DictionaryApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [messages, setMessages] = useState([
    { text: 'Сайн байна уу! Монголын өв, уламжлал, ахуй соёл, үг хэллэгийн талаар асуугаарай. 😊', isUser: false }
  ]);
  const [expandedCards, setExpandedCards] = useState({});
  const [isAiBusy, setIsAiBusy] = useState(false);

  const tabs = ['Home', 'Game', 'Culture'];

  const routeMap = {
    'Home': '/home',
    'Game': '/games',
    'Culture': '/culture',
  };

  const tabFromPath = (path) => {
    const p = (path || '').toLowerCase();
    if (p === '/home' || p === '/') return 'Home';
    if (p === '/games') return 'Game';
    if (p === '/culture') return 'Culture';
    return 'Home';
  };

  const navigateTo = (tab) => {
    const path = routeMap[tab] || '/home';
    setActiveTab(tab);
    window.history.pushState({ tab }, '', path);
  };

  useEffect(() => {
    if (window.location.pathname === '/') {
      window.history.replaceState({ tab: 'Home' }, '', '/home');
    }
    setActiveTab(tabFromPath(window.location.pathname));
    const onPop = () => setActiveTab(tabFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

const [wordCards, setWordCards] = useState([]);

useEffect(() => {
  let mounted = true;
  (async () => {
    try {
      const res = await fetch('/api/word-cards');
      const data = await res.json();
      if (mounted) setWordCards(Array.isArray(data) ? data : []);
    } catch (e) {
      if (mounted) setWordCards([]);
    }
  })();
  return () => { mounted = false; };
}, []);



  const mnNorm = (s) => (s || '').toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/ө/g, 'о')
    .replace(/ү/g, 'у');
  const cyrToAscii = (s) => (s || '').toLowerCase()
    .replace(/а/g, 'a')
    .replace(/б/g, 'b')
    .replace(/в/g, 'v')
    .replace(/г/g, 'g')
    .replace(/д/g, 'd')
    .replace(/е/g, 'e')
    .replace(/ё/g, 'e')
    .replace(/ж/g, 'j')
    .replace(/з/g, 'z')
    .replace(/и/g, 'i')
    .replace(/й/g, 'i')
    .replace(/к/g, 'k')
    .replace(/л/g, 'l')
    .replace(/м/g, 'm')
    .replace(/н/g, 'n')
    .replace(/о/g, 'o')
    .replace(/ө/g, 'o')
    .replace(/п/g, 'p')
    .replace(/р/g, 'r')
    .replace(/с/g, 's')
    .replace(/т/g, 't')
    .replace(/у/g, 'u')
    .replace(/ү/g, 'u')
    .replace(/ф/g, 'f')
    .replace(/х/g, 'h')
    .replace(/ц/g, 'ts')
    .replace(/ч/g, 'ch')
    .replace(/ш/g, 'sh')
    .replace(/щ/g, 'sh')
    .replace(/ъ/g, '')
    .replace(/ь/g, '')
    .replace(/ы/g, 'y')
    .replace(/э/g, 'e')
    .replace(/ю/g, 'yu')
    .replace(/я/g, 'ya');

  const filteredWordCards = (() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return wordCards;
    const qNorm = mnNorm(q);
    const qAscii = q.replace(/[öÖ]/g, 'o').replace(/[üÜ]/g, 'u');
    return wordCards.filter((item) => {
      const w = (item.word || '');
      const p = (item.pronunciation || '');
      const m = (item.meaning || '');
      const exs = Array.isArray(item.examples) ? item.examples : [];
      if (mnNorm(w).includes(qNorm)) return true;
      if (mnNorm(m).includes(qNorm)) return true;
      if (exs.some(ex => mnNorm(ex).includes(qNorm))) return true;
      if (p.toLowerCase().includes(qAscii)) return true;
      if (cyrToAscii(w).includes(qAscii)) return true;
      return false;
    });
  })();

  const buildExplanation = (query) => {
    const q = (query || '').toLowerCase().trim();
    if (!q) return 'Please enter a word to explain.';
    const tokens = q.split(/[^a-zA-ZА-Яа-яҮүӨөЁё]+/).filter(Boolean);
    const matchBy = (item) => {
      const w = (item.word || '').toLowerCase();
      const p = (item.pronunciation || '').toLowerCase();
      if (q === w || q === p) return true;
      if (q.includes(w) || q.includes(p)) return true;
      return tokens.some(t => w === t || p === t);
    };
    const found = wordCards.find(matchBy);
    if (!found) {
      const suggest = wordCards.slice(0, 5).map(it => `${it.word} [${it.pronunciation}]`).join(', ');
      return `I could not find that word in today’s cards.
Try asking about: ${suggest}`;
    }
    const lines = [
      `${found.word} [${found.pronunciation}]`,
      `Meaning: ${found.meaning}`,
      `Examples:`,
      ...found.examples.map((ex, i) => `- ${ex}`)
    ];
    return lines.join('\n');
  };
  const askAI = async (query) => {
    try {
      const res = await fetch('/api/career-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      if (data?.error) {
        return `Алдаа: ${data.error}`;
      }
      return data?.answer || null;
    } catch (e) {
      return null;
    }
  };

  const sendMessage = async () => {
    const input = chatMessage.trim();
    if (!input || isAiBusy) return;
    setChatMessage('');
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setIsAiBusy(true);
    const ai = await askAI(input);
    const reply = buildExplanation(input) || ai;
    setMessages(prev => [...prev, { text: reply, isUser: false }]);
    setIsAiBusy(false);
  };

  // Хэрэв Game хуудас бол GamePage хар
  if (currentPage === 'game') {
    return <GamePage onBack={() => setCurrentPage('home')} sourceWords={wordCards} />;
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
                    navigateTo('Game');
                  } else {
                    setActiveTab(tab);
                    navigateTo(tab);   // ← энд нэгтгэж бичих
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

                    navigateTo(tab);
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
        {activeTab === 'Game' ? (
          <GamePage onBack={() => navigateTo('Home')} sourceWords={wordCards} />
        ) : activeTab === 'Culture' ? (
          <CulturePage />
        ) : (
          <HomePage
            items={filteredWordCards}
            expanded={expandedCards}
            setExpanded={setExpandedCards}
            messages={messages}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
          sendMessage={sendMessage}
          />
          
        )}
      </div>
    </div>
  );
}
