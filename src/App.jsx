import React, { useState, useEffect } from 'react';
import { AlertTriangle, Wind, Sprout, Shield, Sun, Info, Zap, Heart } from 'lucide-react';
import { DONKI_SOLS, DONKI_SOURCE } from './donki.js';
import { TEXTOS } from './textos.js';

export default function App() {
  const [sol, setSol] = useState(1);
  const [energyMax] = useState(100);
  const [systems, setSystems] = useState({
    lifeSupport: { name: 'Soporte Vital', cost: 40, active: true, icon: Wind, desc: 'Filtra el CO2 y produce oxígeno. ¡Si se apaga, la tripulación no puede respirar!' },
    agriculture: { name: 'Módulo Agrícola', cost: 50, active: true, icon: Sprout, desc: 'Cultivos hidropónicos que producen la comida. Si se apaga, las plantas se congelan.' },
    shields: { name: 'Escudos Anti-Radiación', cost: 60, active: false, icon: Shield, desc: 'Protegen a la tripulación de la radiación de las tormentas solares. Consumen mucha energía.' }
  });
  const [message, setMessage] = useState('normal');
  const [blackout, setBlackout] = useState(false);
  const [health, setHealth] = useState(100);
  const [rations, setRations] = useState(100);
  const [gameStatus, setGameStatus] = useState('playing');
  const [started, setStarted] = useState(false);
  const [log, setLog] = useState([]);
  const [endKind, setEndKind] = useState('');
  const [openInfo, setOpenInfo] = useState(null);
  const [showCredits, setShowCredits] = useState(false);
  const [report, setReport] = useState(null);
  const [lang, setLang] = useState('en');
  const T = TEXTOS[lang];

  const currentLoad = Object.values(systems).reduce((acc, sys) => sys.active ? acc + sys.cost : acc, 0);
  const solData = DONKI_SOLS[sol - 1];
  const solarStorm = solData.marsCMEs > 0;
  const stormDanger = solarStorm && !systems.shields.active;

  useEffect(() => {
    if (currentLoad > energyMax) {
      setBlackout(true);
      setMessage('overload');
    } else {
      setBlackout(false);
      if (solarStorm && !systems.shields.active) {
        setMessage('storm');
      } else if (solarStorm && systems.shields.active) {
        setMessage('stormProtected');
      } else {
        setMessage('normal');
      }
    }
  }, [currentLoad, solarStorm, systems.shields.active, sol]);

  const stormData = T.stormAlertData.replace('{n}', solData.marsCMEs).replace('{cme}', solData.marsCMEs === 1 ? T.cmeOne : T.cmeMany);

  const toggleSystem = (key) => {
    setSystems(prev => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active }
    }));
  };

  const nextSol = () => {
    if (gameStatus !== 'playing') return;

    // 1. Apagon: avanzar con mas de 100 kW es derrota (opcion A)
    if (currentLoad > energyMax) {
      setGameStatus('lost');
      setEndKind('blackout');
      return;
    }

    // 2. Efectos por Sol segun Reglas v2 (valores simplificados de juego)
    let newHealth = health;
    let newRations = rations;
    if (!systems.lifeSupport.active) {
      newHealth = Math.max(0, newHealth - 50);
    }
    const healthAfterLifeSupport = newHealth;
    if (systems.agriculture.active) {
      newRations = Math.min(100, newRations + 10);
    } else {
      newRations = Math.max(0, newRations - 20);
    }
    // Tormenta solar: sin escudos, la radiacion baja la salud 40 % (valor simplificado de juego)
    const radiationHit = solarStorm && !systems.shields.active;
    if (radiationHit) {
      newHealth = Math.max(0, newHealth - 40);
    }
    setHealth(newHealth);
    setRations(newRations);

    // Reporte del Sol: usa los cambios realmente calculados arriba
    // Se guardan claves y numeros; el texto se arma al mostrarlo, en el idioma elegido
    const items = [];
    if (solarStorm) {
      items.push(systems.shields.active
        ? { icon: '🛡️', text: 'stormShields', special: 'noRadiationDamage' }
        : { icon: '☢️', text: 'stormNoShields', res: 'health', d: newHealth - healthAfterLifeSupport });
    } else {
      items.push({ icon: '🌤️', text: 'calmDay' });
    }
    if (!systems.lifeSupport.active) {
      items.push({ icon: '💨', text: 'lifeSupportOff', res: 'health', d: healthAfterLifeSupport - health });
    }
    items.push(systems.agriculture.active
      ? { icon: '🌱', text: 'agricultureOn', res: 'food', d: newRations - rations }
      : { icon: '🥀', text: 'agricultureOff', res: 'food', d: newRations - rations });
    setReport({ sol, items });

    // Registro de decisiones para el informe final (solo datos reales de la partida)
    setLog([...log, {
      sol,
      storm: solarStorm,
      shields: systems.shields.active,
      agricultureOff: !systems.agriculture.active
    }]);

    // 3. Derrota por salud o raciones en 0 %
    if (newHealth <= 0) {
      setGameStatus('lost');
      setEndKind(radiationHit ? 'radiation' : 'oxygen');
      return;
    }
    if (newRations <= 0) {
      setGameStatus('lost');
      setEndKind('food');
      return;
    }

    // 4. Victoria al completar el Sol 10
    if (sol >= 10) {
      setGameStatus('won');
      setEndKind('won');
      return;
    }
    setSol(sol + 1);
  };

  const restartMission = () => {
    setSol(1);
    setHealth(100);
    setRations(100);
    setSystems(prev => ({
      ...prev,
      lifeSupport: { ...prev.lifeSupport, active: true },
      agriculture: { ...prev.agriculture, active: true },
      shields: { ...prev.shields, active: false }
    }));
    setGameStatus('playing');
    setReport(null);
    setLog([]);
    setEndKind('');
  };

  const loadOver = currentLoad > energyMax;
  const stats = {
    sols: log.length,
    storms: log.filter(e => e.storm).length,
    protectedStorms: log.filter(e => e.storm && e.shields).length,
    unprotected: log.filter(e => e.storm && !e.shields).length,
    agriOff: log.filter(e => e.agricultureOff).length
  };
  const endReason = { won: T.reasonWon, food: T.reasonFood, radiation: T.reasonRadiation, oxygen: T.reasonOxygen, blackout: T.reasonBlackout }[endKind];
  const messageText = { overload: T.msgOverload, stormProtected: T.msgStormProtected, normal: T.msgNormal }[message];
  const modNames = { lifeSupport: T.modLifeSupport, agriculture: T.modAgriculture, shields: T.modShields };
  const modDescs = { lifeSupport: T.descLifeSupport, agriculture: T.descAgriculture, shields: T.descShields };
  const dateLabel = (n) => {
    const d = DONKI_SOLS[n - 1];
    return lang === 'es' ? d.label : new Date(d.date + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  };
  const changeText = (it) => {
    if (it.special) return T[it.special];
    if (!it.res) return '';
    const label = it.res === 'health' ? T.health : T.food;
    return it.d === 0 ? `${label}: ${T.noChange}` : `${label} ${it.d > 0 ? '+' : ''}${it.d} %`;
  };
  const langToggle = (
    <button className="lang-btn" onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>🌐 {T.langButton}</button>
  );
  const strategy = { won: T.stratWin, food: T.stratFood, radiation: T.stratRadiation, oxygen: T.stratOxygen, blackout: T.stratBlackout }[endKind];
  const alertLevel = (blackout || stormDanger) ? 'danger' : (solarStorm ? 'storm' : 'ok');
  const alertColors = {
    danger: { bg: '#ffd6d1', border: '#d90000', title: T.alertDanger },
    storm: { bg: '#ffd6d1', border: '#d90000', title: T.alertStorm },
    ok: { bg: '#fff8e7', border: '#d4a017', title: T.alertOk }
  }[alertLevel];

  const Bar = ({ icon, label, value, max, color, text }) => (
    <div className="bar-row">
      <div className="bar-icon" style={{ backgroundColor: color }}>{icon}</div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${Math.min(100, (value / max) * 100)}%`, backgroundColor: color }} />
        <span className="bar-text">{text}</span>
      </div>
    </div>
  );

  if (!started) {
    return (
      <div className="mars-bg">
        <div className="intro">
          <div style={{ textAlign: 'right' }}>{langToggle}</div>
          <h1>{T.introTitle}</h1>
          <p className="intro-question">{T.introQuestion}</p>
          <p>{T.introText}</p>
          <p className="intro-goal">🎯 {T.introShortGoal}</p>
          <p className="intro-phrase">{T.introPhrase}</p>
          <button className="next-btn" onClick={() => setStarted(true)}>{T.startButton}</button>
        </div>
        <style>{`
          .mars-bg { min-height: 100vh; background: linear-gradient(rgba(120, 45, 25, 0.35), rgba(60, 20, 10, 0.55)), url('/img/fondo-marte.jpg') center / cover fixed, #8e3b2a; padding: 16px; box-sizing: border-box; font-family: system-ui, sans-serif; color: #2c3e50; }
          .intro { max-width: 720px; margin: 30px auto; background: #fdfefe; border: 4px solid #2c3e50; border-radius: 16px; padding: 24px; text-align: center; }
          .intro h1 { color: #c0392b; font-size: 30px; margin: 0 0 8px; }
          .intro p { font-size: 17px; line-height: 1.45; margin: 10px 0; }
          .intro-question { font-size: 20px !important; font-weight: 800; }
          .intro-goal { font-weight: 800; }
          .intro-phrase { font-weight: 800; color: #c0392b; font-size: 19px !important; }
          .lang-btn { background: #2c3e50; color: #fff; border: 2px solid #fff; border-radius: 8px; font-weight: 800; font-size: 15px; padding: 6px 12px; cursor: pointer; }
          .next-btn { margin-top: 10px; background: #f39c12; border: 3px solid #2c3e50; border-radius: 12px; color: #fff; font-size: 24px; font-weight: 900; padding: 12px 22px; cursor: pointer; text-shadow: 1px 1px 2px #000; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="mars-bg">
      <div className="game">
        <div className="top">
          <div className="top-left">
            <div className="title-row">
              <div className="title-tag">{T.titleMain} <span>{T.titleSub}</span></div>
              {langToggle}
            </div>
            <div className={`alert-box ${alertLevel !== 'ok' ? 'alert-pulse' : ''}`} style={{ backgroundColor: alertColors.bg, borderColor: alertColors.border }}>
              <div className="alert-title">
                {alertLevel === 'ok' ? <Info size={20} /> : <AlertTriangle size={20} color={alertColors.border} />}
                {alertColors.title}
              </div>
              {message === 'storm' ? (
                <div className="storm-alert">
                  <p className="storm-title">{T.stormAlertTitle}</p>
                  <p>🛡️ {T.stormOptionShields}</p>
                  <p>☢️ {T.stormOptionNoShields}</p>
                  <p className="storm-data">{stormData}</p>
                </div>
              ) : (sol === 1 && !report && message === 'normal') ? (
                <div className="howto">
                  <p className="storm-title">{T.howToTitle}</p>
                  <p>1️⃣ {T.howTo1}</p>
                  <p>2️⃣ {T.howTo2}</p>
                  <p>3️⃣ {T.howTo3}</p>
                </div>
              ) : (
                <p>{messageText}</p>
              )}
            </div>
          </div>

          <div className="bars">
            <Bar icon={<Zap size={22} />} value={currentLoad} max={energyMax}
              color={loadOver ? '#c0392b' : '#27ae60'} text={`${T.barEnergy}: ${currentLoad} / ${energyMax} kW${loadOver ? ' ' + T.overload : ''}`} />
            <Bar icon={<Heart size={22} />} value={health} max={100}
              color="#e74c3c" text={`${T.barHealth}: ${health} %`} />
            <Bar icon={<Sprout size={22} />} value={rations} max={100}
              color="#e67e22" text={`${T.barFood}: ${rations} %`} />
          </div>

          <div className="sol-card">
            <div className="sol-num"><span>SOL</span> <Sun size={34} color="#f39c12" /></div>
            <div className="sol-big">{sol}/10</div>
            <div className="sol-date">{dateLabel(sol)}</div>
            {solarStorm && <div className="storm-chip">{T.stormChip}</div>}
          </div>
        </div>

        {report && (
          <div className="report">
            <div className="report-title">📋 {T.reportTitle} {report.sol} · {dateLabel(report.sol)}</div>
            {report.items.map((it, i) => (
              <div key={i} className="report-item">
                <span className="report-icon">{it.icon}</span>
                <span className="report-text">{T[it.text]}</span>
                {changeText(it) && <span className="report-change">{changeText(it)}</span>}
              </div>
            ))}
            <div className="report-note">{T.simplified}</div>
          </div>
        )}

        <div className="modules">
          {Object.entries(systems).map(([key, sys]) => (
            <div key={key} className="module">
              <h3>{modNames[key].toUpperCase()}</h3>
              <div className={`module-art art-${key} ${sys.active ? '' : 'art-off'}`}>
                <span className="ai-mark">AI-generated image (Gemini)</span>
              </div>
              <div className="module-kw">-{sys.cost} kW</div>
              <div className="module-actions">
                <button
                  className={`state-btn ${sys.active ? 'on' : 'off'}`}
                  onClick={() => toggleSystem(key)}
                  disabled={gameStatus !== 'playing'}>
                  {sys.active ? T.stateOn : T.stateOff}
                  <small>{sys.active ? T.tapOff : T.tapOn}</small>
                </button>
                <button className="info-btn" aria-label={`${T.infoAbout} ${modNames[key]}`}
                  onClick={() => setOpenInfo(openInfo === key ? null : key)}>i</button>
              </div>
              {openInfo === key && <div className="info-bubble">{modDescs[key]}</div>}
            </div>
          ))}
        </div>

        {gameStatus === 'playing' ? (
          <div className="bottom">
            <button className="next-btn" onClick={nextSol}>
              {sol >= 10 ? T.finishMission : T.nextSol}
            </button>
            <button className="credits-btn" onClick={() => setShowCredits(!showCredits)}>
              {T.creditsButton}
            </button>
          </div>
        ) : (
          <div className="end-panel" style={{ backgroundColor: gameStatus === 'won' ? '#1e8449' : '#922b21' }}>
            <h2>{gameStatus === 'won' ? T.victory : T.missionFailed}</h2>
            <p className="end-title">{gameStatus === 'won' ? T.endWinTitle : T.endLoseTitle}</p>
            <p>{endReason}</p>
            <div className="final-report">
              <h3>📋 {T.reportFinalTitle}</h3>
              <div className="stats">
                <div><span>{T.statSols}</span><strong>{stats.sols} / 10</strong></div>
                <div><span>{T.statStorms}</span><strong>{stats.storms}</strong></div>
                <div><span>🛡️ {T.statProtected}</span><strong>{stats.protectedStorms}</strong></div>
                <div><span>☢️ {T.statUnprotected}</span><strong>{stats.unprotected}</strong></div>
                <div><span>🥀 {T.statAgriOff}</span><strong>{stats.agriOff}</strong></div>
                <div><span>❤️🍽️ {T.statFinal}</span><strong>{health} % · {rations} %</strong></div>
              </div>
              {strategy && <p><strong>{T.strategyTitle}:</strong> {strategy}</p>}
              <p><strong>{T.learningTitle}:</strong> {T.learning}</p>
            </div>
            <div className="end-actions">
              <button onClick={restartMission}>{T.restart}</button>
              <button onClick={() => setShowCredits(!showCredits)}>{T.creditsButton}</button>
            </div>
          </div>
        )}

        {showCredits && (
          <div className="credits">
            <h3>{T.creditsTitle}</h3>
            <p>
              {T.creditsStorms} <a href={DONKI_SOURCE.page} target="_blank" rel="noreferrer">{DONKI_SOURCE.name}</a> ({T.creditsPeriod}).
              {' '}{T.creditsModel}
            </p>
            <p>{T.creditsSimplified}</p>
            <p>
              {T.creditsBackground}{' '}
              <a href="https://science.nasa.gov/photojournal/water-enters-jezero-crater-billions-of-years-ago-artists-concept/" target="_blank" rel="noreferrer">NASA Photojournal</a>
            </p>
            <p>{T.creditsAI}</p>
            <button onClick={() => setShowCredits(false)}>{T.close}</button>
          </div>
        )}
      </div>

      <style>{`
        .mars-bg { min-height: 100vh; background: linear-gradient(rgba(120, 45, 25, 0.35), rgba(60, 20, 10, 0.55)), url('/img/fondo-marte.jpg') center / cover fixed, #8e3b2a; padding: 16px; box-sizing: border-box; font-family: system-ui, sans-serif; color: #2c3e50; }
        .game { max-width: 1000px; margin: 0 auto; }
        .top { display: grid; grid-template-columns: 1.1fr 1.3fr 0.7fr; gap: 14px; align-items: start; }
        .title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
        .lang-btn { background: #2c3e50; color: #fff; border: 2px solid #fff; border-radius: 8px; font-weight: 800; font-size: 14px; padding: 6px 10px; cursor: pointer; white-space: nowrap; }
        .title-tag { background: #2c3e50; color: #fff; font-weight: 800; font-size: 20px; padding: 8px 14px; border-radius: 0 0 12px 0; margin-bottom: 10px; display: inline-block; }
        .title-tag span { font-size: 15px; font-weight: 600; }
        .alert-box { border: 4px solid; border-radius: 10px; padding: 10px 14px; box-shadow: 0 3px 0 rgba(0,0,0,0.2); }
        .alert-title { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 15px; }
        .storm-alert p, .howto p { margin: 6px 0 0; }
        .alert-pulse { border-width: 5px; animation: alertPulse 1.2s ease-in-out infinite; }
        @keyframes alertPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217, 0, 0, 0.0), 0 3px 0 rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 0 8px rgba(217, 0, 0, 0.45), 0 3px 0 rgba(0,0,0,0.2); }
        }
        @media (prefers-reduced-motion: reduce) { .alert-pulse { animation: none; } }
        .storm-title { font-size: 18px !important; font-weight: 900 !important; }
        .storm-data { font-size: 12px !important; font-weight: 500 !important; color: #555; }
        .alert-box p { margin: 6px 0 0; font-size: 15px; font-weight: 600; line-height: 1.35; }
        .bars { display: flex; flex-direction: column; gap: 12px; padding-top: 6px; }
        .bar-row { display: flex; align-items: center; }
        .bar-icon { width: 46px; height: 46px; border-radius: 50%; border: 3px solid #2c3e50; color: #fff; display: flex; align-items: center; justify-content: center; z-index: 1; flex-shrink: 0; }
        .bar-track { position: relative; flex: 1; height: 34px; margin-left: -12px; background: #34495e; border: 3px solid #2c3e50; border-radius: 0 10px 10px 0; overflow: hidden; }
        .bar-fill { height: 100%; transition: width 0.4s; }
        .bar-text { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: #fff; font-weight: 800; font-size: 16px; text-shadow: 1px 1px 2px #000; white-space: nowrap; }
        .sol-card { background: #ecf0f1; border: 3px solid #2c3e50; border-radius: 0 0 0 18px; padding: 8px 12px; text-align: center; }
        .sol-num { font-size: 30px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .sol-big { font-size: 40px; font-weight: 900; line-height: 1; }
        .sol-date { font-size: 13px; margin-top: 4px; color: #555; }
        .storm-chip { margin-top: 6px; background: #e67e22; color: #fff; font-weight: 800; font-size: 13px; border-radius: 6px; padding: 3px 6px; }
        .report { margin-top: 16px; background: #fdfefe; border: 3px solid #2c3e50; border-radius: 12px; padding: 12px 14px; }
        .report-title { font-weight: 900; font-size: 17px; margin-bottom: 8px; }
        .report-item { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-top: 1px solid #d5dbdb; }
        .report-icon { font-size: 22px; flex-shrink: 0; }
        .report-text { flex: 1; font-size: 15px; font-weight: 600; line-height: 1.35; }
        .report-change { flex-shrink: 0; background: #2c3e50; color: #fff; font-weight: 800; font-size: 14px; border-radius: 6px; padding: 4px 8px; white-space: nowrap; }
        .report-note { margin-top: 6px; font-size: 12px; color: #7f8c8d; }
        .modules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 18px; }
        .module { background: #dfe6e9; border: 3px solid #2c3e50; border-radius: 12px; padding: 10px; text-align: center; position: relative; }
        .module h3 { margin: 0 0 8px; font-size: 16px; font-weight: 900; }
        .module-art { height: 130px; border: 3px solid #2c3e50; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; }
        .module-art { background-size: cover; background-position: left center; transition: filter 0.3s; }
        .art-lifeSupport { background-image: url('/img/soporte-vital.jpg'); }
        .art-agriculture { background-image: url('/img/agricultura.jpg'); }
        .art-shields { background-image: url('/img/escudos.jpg'); }
        .art-off { filter: grayscale(1) brightness(0.6); }
        .module-art { position: relative; }
        .ai-mark { position: absolute; right: 4px; bottom: 4px; background: rgba(0,0,0,0.65); color: #fff; font-size: 10px; font-weight: 600; padding: 2px 5px; border-radius: 4px; }
        .module-kw { font-size: 24px; font-weight: 900; margin: 8px 0; }
        .module-actions { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .state-btn { border: 3px solid #2c3e50; border-radius: 10px; color: #fff; font-size: 20px; font-weight: 900; padding: 6px 14px; cursor: pointer; display: flex; flex-direction: column; align-items: center; min-width: 150px; }
        .state-btn small { font-size: 11px; font-weight: 600; opacity: 0.9; }
        .state-btn.on { background: #27ae60; }
        .state-btn.off { background: #c0392b; }
        .state-btn:disabled { cursor: not-allowed; opacity: 0.7; }
        .info-btn { width: 36px; height: 36px; border-radius: 50%; border: 3px solid #fff; background: #2e86c1; color: #fff; font-weight: 900; font-style: italic; font-size: 18px; cursor: pointer; flex-shrink: 0; }
        .info-bubble { margin-top: 10px; background: #fff; border: 2px solid #2c3e50; border-radius: 10px; padding: 8px; font-size: 14px; font-weight: 600; }
        .bottom { display: flex; justify-content: flex-end; align-items: stretch; gap: 12px; margin-top: 18px; }
        .next-btn { background: #f39c12; border: 3px solid #2c3e50; border-radius: 12px; color: #fff; font-size: 24px; font-weight: 900; padding: 12px 22px; cursor: pointer; text-shadow: 1px 1px 2px #000; }
        .credits-btn { background: #ecf0f1; border: 3px solid #2c3e50; border-radius: 12px; font-weight: 700; font-size: 13px; padding: 8px; cursor: pointer; max-width: 120px; }
        .end-panel { margin-top: 18px; padding: 22px; border-radius: 12px; border: 3px solid #2c3e50; text-align: center; color: #fff; }
        .end-panel h2 { margin: 0 0 8px; }
        .end-title { font-weight: 800; font-size: 20px !important; }
        .final-report { background: #fdfefe; color: #2c3e50; border-radius: 10px; padding: 12px 14px; margin: 0 0 16px; text-align: left; }
        .final-report h3 { margin: 0 0 8px; }
        .final-report p { font-size: 15px !important; margin: 8px 0 0 !important; line-height: 1.4; }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
        .stats div { display: flex; justify-content: space-between; gap: 8px; background: #ecf0f1; border-radius: 6px; padding: 6px 8px; font-size: 14px; }
        .end-panel p { font-size: 18px; margin: 0 0 16px; }
        .end-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .end-actions button, .credits button { padding: 10px 18px; font-size: 16px; font-weight: 700; border: none; border-radius: 8px; background: #ecf0f1; color: #2c3e50; cursor: pointer; }
        .credits { margin-top: 14px; background: #fdfefe; border: 3px solid #2c3e50; border-radius: 12px; padding: 14px; font-size: 14px; line-height: 1.5; }
        .credits h3 { margin-top: 0; }
        .credits a { color: #2e86c1; }
        @media (max-width: 800px) {
          .top { grid-template-columns: 1fr; }
          .modules { grid-template-columns: 1fr; }
          .bottom { flex-direction: column; }
          .credits-btn { max-width: none; }
        }
      `}</style>
    </div>
  );
}
