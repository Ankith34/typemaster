import { useEffect, useRef, useState, useCallback } from "react";
 
const wordBank = [
  "the", "be", "of", "and", "a", "to", "in", "have", "it", "that", "for", "they", "with", "as", "not", "on", "she", "at", "by",
  "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more",
  "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some",
  "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most",
  "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well",
  "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "high", "place", "little", "world", "still",
  "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "under",
  "last", "right", "move", "thing", "school", "never", "same", "another", "system", "program", "every", "real", "left", "number",
];
 
function getRandomWords(count = 80) {
  return Array.from({ length: count }, () => wordBank[Math.floor(Math.random() * wordBank.length)]);
}
 
const FONT_URL = "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&display=swap";
 
const GlobalStyle = () => (
  <style>{`
    @import url('${FONT_URL}');
 
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
    :root {
      --bg:      #2c2e31;
      --sub-alt: #3a3c40;
      --sub:     #646669;
      --text:    #d1d0c5;
      --main:    #e2b714;
      --error:   #ca4754;
    }
 
    html, body, #root {
      height: 100%;
      background: var(--bg);
      font-family: 'Roboto Mono', monospace;
      color: var(--text);
      overflow: hidden;
    }
 
    .app {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      padding: 0 24px;
    }
 
    /* ── LOGO ── */
    .nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 26px 0;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 9px;
    }
    .logo-icon {
      font-size: 17px;
      color: var(--main);
    }
    .logo-name {
      font-size: 1.2rem;
      font-weight: 400;
      color: var(--sub);
      letter-spacing: -0.01em;
    }
    .logo-name span { color: var(--main); }
 
    /* ── TIME SELECTOR ── */
    .time-row {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-bottom: 40px;
      background: var(--sub-alt);
      border-radius: 10px;
      padding: 3px;
    }
    .time-btn {
      background: none;
      border: none;
      color: var(--sub);
      font-family: 'Roboto Mono', monospace;
      font-size: 0.82rem;
      padding: 8px 22px;
      border-radius: 8px;
      cursor: pointer;
      transition: color 0.15s, background 0.15s;
    }
    .time-btn:hover:not(:disabled) { color: var(--text); }
    .time-btn.active { color: var(--main); background: var(--bg); }
    .time-btn:disabled { opacity: 0.4; cursor: default; }
 
    /* ── TIMER ── */
    .live-time {
      font-size: 2rem;
      font-weight: 300;
      color: var(--main);
      margin-bottom: 14px;
      line-height: 1;
      min-height: 2rem;
    }
 
    /* ── WORDS AREA ── */
    .words-area {
      width: 100%;
      max-width: 1000px;
      overflow: hidden;
      height: 130px;
      position: relative;
      cursor: default;
    }
 
    .words-inner {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 0;
      line-height: 1;
    }
    .word {
      display: inline-flex;
      margin-right: 14px;
      font-size: 1.5rem;
      font-weight: 400;
    }
 
    .char { position: relative; }
    .char.default { color: var(--sub); }
    .char.correct { color: var(--text); }
    .char.wrong   { color: var(--error); }
 
    .char.cursor-before::before {
      content: '';
      position: absolute;
      left: -1.5px; top: 2px; bottom: 2px;
      width: 2.5px;
      background: var(--main);
      border-radius: 2px;
      animation: blink 1s step-end infinite;
    }
 
    /* ── HINT ── */
    .hint {
      margin-top: 22px;
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--sub);
      font-size: 0.7rem;
    }
    .kbtn {
      background: var(--sub-alt);
      color: var(--sub);
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.68rem;
      font-family: inherit;
    }
 
    /* ── RESULTS ── */
    .results-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      animation: fadeIn 0.3s ease;
      z-index: 20;
    }
    .results-label {
      font-size: 0.65rem;
      color: var(--sub);
      letter-spacing: 0.2em;
      margin-bottom: 20px;
    }
    .results-grid {
      display: flex;
      gap: 52px;
      align-items: flex-end;
    }
    .result-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .result-lbl {
      font-size: 0.65rem;
      color: var(--sub);
      letter-spacing: 0.12em;
    }
    .result-num {
      font-size: 4.5rem;
      font-weight: 300;
      color: var(--main);
      line-height: 1;
    }
    .result-num.sm { font-size: 3rem; }
    .restart-hint {
      margin-top: 36px;
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--sub);
      font-size: 0.7rem;
    }
 
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `}</style>
);
 
function WordsDisplay({ words, currentIndex, charIndex, typedCharMap }) {
  const innerRef = useRef(null);
  const activeRef = useRef(null);
 
  useEffect(() => {
    if (!activeRef.current || !innerRef.current) return;
    const parent = innerRef.current.parentElement;
    const el = activeRef.current;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    if (elTop < parent.scrollTop + 28 || elBottom > parent.scrollTop + parent.clientHeight) {
      parent.scrollTo({ top: elTop - 36, behavior: "smooth" });
    }
  }, [currentIndex]);
 
  return (
    <div ref={innerRef} className="words-inner">
      {words.map((word, wi) => (
        <span key={wi} className="word" ref={wi === currentIndex ? activeRef : null}>
          {word.split("").map((ch, ci) => {
            const typed = typedCharMap[wi]?.[ci];
            const isCursor = wi === currentIndex && ci === charIndex;
            let cls = "char default";
            if (wi < currentIndex) cls = `char ${typed === ch ? "correct" : "wrong"}`;
            else if (wi === currentIndex && typed !== undefined) cls = `char ${typed === ch ? "correct" : "wrong"}`;
            if (isCursor) cls += " cursor-before";
            return <span key={ci} className={cls}>{ch}</span>;
          })}
          {wi === currentIndex && charIndex === word.length && (
            <span className="char cursor-before">&nbsp;</span>
          )}
        </span>
      ))}
    </div>
  );
}
 
export default function App() {
  const [words, setWords] = useState(getRandomWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typedWords, setTypedWords] = useState([]);
  const [typedCharMap, setTypedCharMap] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
 
  const reset = useCallback((t) => {
    const time = t ?? selectedTime;
    setWords(getRandomWords());
    setTypedCharMap({});
    setTypedWords([]);
    setCurrentIndex(0);
    setCharIndex(0);
    setIsFinished(false);
    setTimeLeft(time);
    setIsRunning(false);
  }, [selectedTime]);
 
  useEffect(() => {
    const onKey = (e) => {
      if (isFinished) {
        if (e.key === "Tab") e.preventDefault();
        if (e.key === "Enter") reset();
        return;
      }
      if (e.key === "Tab") { e.preventDefault(); reset(); return; }
      if (!isRunning && e.key.length === 1) setIsRunning(true);
      if (e.key === " ") {
        e.preventDefault();
        if (!isRunning) return;
        setTypedWords(p => [...p, (typedCharMap[currentIndex] || []).join("")]);
        setCharIndex(0);
        setCurrentIndex(p => p + 1);
      } else if (e.key === "Backspace") {
        if (!isRunning) return;
        setCharIndex(p => Math.max(p - 1, 0));
        setTypedCharMap(p => {
          const u = { ...p }, arr = [...(u[currentIndex] || [])];
          arr.pop(); u[currentIndex] = arr; return u;
        });
      } else if (e.key.length === 1) {
        if (!isRunning) return;
        setTypedCharMap(p => {
          const u = { ...p }, arr = [...(u[currentIndex] || [])];
          arr[charIndex] = e.key; u[currentIndex] = arr; return u;
        });
        setCharIndex(p => p + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [charIndex, currentIndex, isRunning, isFinished, typedCharMap, reset]);
 
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(id); setIsRunning(false); setIsFinished(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);
 
  const wpm = (() => {
    const mins = selectedTime / 60;
    const correct = typedWords.reduce((acc, w, i) => acc + (w === words[i] ? w.length + 1 : 0), 0);
    return Math.max(0, Math.round((correct / 5) / mins));
  })();
 
  const accuracy = typedWords.length
    ? Math.round((typedWords.filter((w, i) => w === words[i]).length / typedWords.length) * 100)
    : 100;
 
  const timeLabels = { 15: "15s", 30: "30s", 60: "1 min", 120: "2 min" };
 
  return (
    <>
      <GlobalStyle />
      <div className="app" tabIndex={-1} style={{ outline: "none" }}>
 
        <nav className="nav">
          <div className="logo">
            <span className="logo-icon">⌨</span>
            <span className="logo-name">type <span>master</span></span>
          </div>
        </nav>
 
        <div className="time-row">
          {[15, 30, 60, 120].map(t => (
            <button
              key={t}
              className={`time-btn ${selectedTime === t ? "active" : ""}`}
              disabled={isRunning}
              onClick={() => { setSelectedTime(t); reset(t); }}
            >
              {timeLabels[t]}
            </button>
          ))}
        </div>
 
        <div className="live-time">{timeLeft}</div>
 
        <div className="words-area">
          <WordsDisplay
            words={words}
            currentIndex={currentIndex}
            charIndex={charIndex}
            typedCharMap={typedCharMap}
          />
        </div>
 
        {!isRunning && !isFinished && (
          <div className="hint">
            <span className="kbtn">tab</span>
            <span>to restart</span>
          </div>
        )}
 
        {isFinished && (
          <div className="results-overlay">
            <div className="results-label">results</div>
            <div className="results-grid">
              <div className="result-item">
                <div className="result-lbl">wpm</div>
                <div className="result-num">{wpm}</div>
              </div>
              <div className="result-item">
                <div className="result-lbl">accuracy</div>
                <div className="result-num sm">{accuracy}%</div>
              </div>
              <div className="result-item">
                <div className="result-lbl">time</div>
                <div className="result-num sm">{timeLabels[selectedTime]}</div>
              </div>
            </div>
            <div className="restart-hint">
              <span className="kbtn">tab</span>
              <span>+</span>
              <span className="kbtn">enter</span>
              <span style={{ marginLeft: 4 }}>to restart</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}