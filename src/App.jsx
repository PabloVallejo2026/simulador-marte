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
  const [message, setMessage] = useState("Día tranquilo en Marte. Gestiona la energía sabiamente.");
  const [blackout, setBlackout] = useState(false);
  const [health, setHealth] = useState(100);
  const [rations, setRations] = useState(100);
  const [gameStatus, setGameStatus] = useState('playing');
  const [openInfo, setOpenInfo] = useState(null);
  const [showCredits, setShowCredits] = useState(false);
  const [report, setReport] = useState(null);
  const lang = 'es'; // preparado para el selector Español / English
  const T = TEXTOS[lang];
  const [endReason, setEndReason] = useState('');

  const currentLoad = Object.values(systems).reduce((acc, sys) => sys.active ? acc + sys.cost : acc, 0);
  const solData = DONKI_SOLS[sol - 1];
  const solarStorm = solData.marsCMEs > 0;
  const stormDanger = solarStorm && !systems.shields.active;

  useEffect(() => {
    if (currentLoad > energyMax) {
      setBlackout(true);
      setMessage("¡Sobrecarga! La base supera los 100 kW. Si avanzás al siguiente Sol habrá un apagón general.");
    } else {
      setBlackout(false);
      if (solarStorm && !systems.shields.active) {
        setMessage(`¡Hoy llega una tormenta solar! Datos reales de NASA DONKI: ${solData.marsCMEs} ${solData.marsCMEs === 1 ? 'eyección' : 'eyecciones'} de masa coronal con llegada estimada a Marte este día. Encendé los escudos antes de avanzar (apagá Agricultura para no superar los 100 kW).`);
      } else if (solarStorm && systems.shields.active) {
        setMessage("Tormenta solar hoy: los escudos están encendidos. La tripulación está protegida.");
      } else {
        setMessage("Sistemas operando dentro de los parámetros normales.");
      }
    }
  }, [currentLoad, solarStorm, systems.shields.active, sol]);

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
      setEndReason('¡Apagón general! La base consumió más de 100 kW y el generador se apagó.');
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
    const change = (label, d) => d === 0 ? `${label}: ${T.noChange}` : `${label} ${d > 0 ? '+' : ''}${d} %`;
    const items = [];
    if (solarStorm) {
      items.push(systems.shields.active
        ? { icon: '🛡️', text: T.stormShields, change: T.noRadiationDamage }
        : { icon: '☢️', text: T.stormNoShields, change: change(T.health, newHealth - healthAfterLifeSupport) });
    } else {
      items.push({ icon: '🌤️', text: T.calmDay, change: '' });
    }
    if (!systems.lifeSupport.active) {
      items.push({ icon: '💨', text: T.lifeSupportOff, change: change(T.health, healthAfterLifeSupport - health) });
    }
    items.push(systems.agriculture.active
      ? { icon: '🌱', text: T.agricultureOn, change: change(T.food, newRations - rations) }
      : { icon: '🥀', text: T.agricultureOff, change: change(T.food, newRations - rations) });
    setReport({ sol, label: solData.label, items });

    // 3. Derrota por salud o raciones en 0 %
    if (newHealth <= 0) {
      setGameStatus('lost');
      setEndReason(radiationHit
        ? 'La salud de la tripulación llegó a 0 %. La radiación de la tormenta solar entró en la base sin escudos.'
        : 'La salud de la tripulación llegó a 0 %. Sin Soporte Vital no hay oxígeno.');
      return;
    }
    if (newRations <= 0) {
      setGameStatus('lost');
      setEndReason('Las raciones llegaron a 0 %. Sin el Módulo Agrícola no hay comida.');
      return;
    }

    // 4. Victoria al completar el Sol 10
    if (sol >= 10) {
      setGameStatus('won');
      setEndReason('¡Misión cumplida! La tripulación sobrevivió 10 soles en Marte.');
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
    setEndReason('');
    setReport(null);
  };

  const loadOver = currentLoad > energyMax;
  const alertLevel = (blackout || stormDanger) ? 'danger' : (solarStorm ? 'storm' : 'ok');
  const alertColors = {
    danger: { bg: '#fdecea', border: '#c0392b', title: '¡Atención!' },
    storm: { bg: '#fff4d6', border: '#e67e22', title: 'Alerta de clima espacial (datos de NASA)' },
    ok: { bg: '#fff8e7', border: '#d4a017', title: 'Centro de control' }
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

  return (
    <div className="mars-bg">
      <div className="game">
        <div className="top">
          <div className="top-left">
            <div className="title-tag">Misión Marte: <span>Base de Supervivencia</span></div>
            <div className="alert-box" style={{ backgroundColor: alertColors.bg, borderColor: alertColors.border }}>
              <div className="alert-title">
                {alertLevel === 'ok' ? <Info size={20} /> : <AlertTriangle size={20} color={alertColors.border} />}
                {alertColors.title}
              </div>
              <p>{message}</p>
            </div>
          </div>

          <div className="bars">
            <Bar icon={<Zap size={22} />} label="Energía" value={currentLoad} max={energyMax}
              color={loadOver ? '#c0392b' : '#27ae60'} text={`ENERGÍA: ${currentLoad} / ${energyMax} kW${loadOver ? ' ¡SOBRECARGA!' : ''}`} />
            <Bar icon={<Heart size={22} />} label="Salud" value={health} max={100}
              color="#e74c3c" text={`SALUD: ${health} %`} />
            <Bar icon={<Sprout size={22} />} label="Comida" value={rations} max={100}
              color="#e67e22" text={`COMIDA: ${rations} %`} />
          </div>

          <div className="sol-card">
            <div className="sol-num"><span>SOL</span> <Sun size={34} color="#f39c12" /></div>
            <div className="sol-big">{sol}/10</div>
            <div className="sol-date">{solData.label}</div>
            {solarStorm && <div className="storm-chip">☀️ Tormenta solar</div>}
          </div>
        </div>

        {report && (
          <div className="report">
            <div className="report-title">📋 {T.reportTitle} {report.sol} · {report.label}</div>
            {report.items.map((it, i) => (
              <div key={i} className="report-item">
                <span className="report-icon">{it.icon}</span>
                <span className="report-text">{it.text}</span>
                {it.change && <span className="report-change">{it.change}</span>}
              </div>
            ))}
            <div className="report-note">{T.simplified}</div>
          </div>
        )}

        <div className="modules">
          {Object.entries(systems).map(([key, sys]) => (
            <div key={key} className="module">
              <h3>{sys.name.toUpperCase()}</h3>
              <div className={`module-art art-${key}`}>
                <sys.icon size={64} />
              </div>
              <div className="module-kw">-{sys.cost} kW</div>
              <div className="module-actions">
                <button
                  className={`state-btn ${sys.active ? 'on' : 'off'}`}
                  onClick={() => toggleSystem(key)}
                  disabled={gameStatus !== 'playing'}>
                  {sys.active ? 'ENCENDIDO' : 'APAGADO'}
                  <small>{sys.active ? 'Tocá para apagar' : 'Tocá para encender'}</small>
                </button>
                <button className="info-btn" aria-label={`Información sobre ${sys.name}`}
                  onClick={() => setOpenInfo(openInfo === key ? null : key)}>i</button>
              </div>
              {openInfo === key && <div className="info-bubble">{sys.desc}</div>}
            </div>
          ))}
        </div>

        {gameStatus === 'playing' ? (
          <div className="bottom">
            <button className="next-btn" onClick={nextSol}>
              {sol >= 10 ? 'TERMINAR MISIÓN ➜' : 'AVANZAR AL SIGUIENTE SOL ➜'}
            </button>
            <button className="credits-btn" onClick={() => setShowCredits(!showCredits)}>
              Datos científicos / Créditos
            </button>
          </div>
        ) : (
          <div className="end-panel" style={{ backgroundColor: gameStatus === 'won' ? '#1e8449' : '#922b21' }}>
            <h2>{gameStatus === 'won' ? '🏆 ¡Victoria!' : '💥 Misión fallida'}</h2>
            <p>{endReason}</p>
            <div className="end-actions">
              <button onClick={restartMission}>🔄 Reiniciar misión</button>
              <button onClick={() => setShowCredits(!showCredits)}>Datos científicos / Créditos</button>
            </div>
          </div>
        )}

        {showCredits && (
          <div className="credits">
            <h3>Datos científicos y créditos</h3>
            <p>
              Tormentas solares: datos reales de <a href={DONKI_SOURCE.page} target="_blank" rel="noreferrer">{DONKI_SOURCE.name}</a> ({DONKI_SOURCE.period}).
              Cada Sol del juego corresponde a un día de ese período. Las llegadas a Marte de las eyecciones de masa coronal
              son estimaciones del modelo WSA-ENLIL, no mediciones en Marte.
            </p>
            <p>Los consumos de energía y los daños a la salud y a las raciones son valores simplificados para el juego.</p>
            <button onClick={() => setShowCredits(false)}>Cerrar</button>
          </div>
        )}
      </div>

      <style>{`
        .mars-bg { min-height: 100vh; background: linear-gradient(180deg, #e8916b 0%, #c8553d 45%, #8e3b2a 100%); padding: 16px; box-sizing: border-box; font-family: system-ui, sans-serif; color: #2c3e50; }
        .game { max-width: 1000px; margin: 0 auto; }
        .top { display: grid; grid-template-columns: 1.1fr 1.3fr 0.7fr; gap: 14px; align-items: start; }
        .title-tag { background: #2c3e50; color: #fff; font-weight: 800; font-size: 20px; padding: 8px 14px; border-radius: 0 0 12px 0; margin-bottom: 10px; display: inline-block; }
        .title-tag span { font-size: 15px; font-weight: 600; }
        .alert-box { border: 4px solid; border-radius: 10px; padding: 10px 14px; box-shadow: 0 3px 0 rgba(0,0,0,0.2); }
        .alert-title { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 15px; }
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
        .module-art { height: 110px; border: 3px solid #2c3e50; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; }
        .art-lifeSupport { background: linear-gradient(135deg, #5dade2, #2e86c1); }
        .art-agriculture { background: linear-gradient(135deg, #a569bd, #58d68d); }
        .art-shields { background: linear-gradient(135deg, #cd6155, #85c1e9); }
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
