import React, { useState, useEffect } from 'react';
import { AlertTriangle, Power, Wind, Sprout, Shield, Sun, Info } from 'lucide-react';

const Tooltip = ({ children, text }) => (
  <div style={{ position: 'relative', display: 'inline-block', cursor: 'help' }} className="group">
    {children}
    <div style={{
      visibility: 'hidden', backgroundColor: '#333', color: '#fff', textAlign: 'center',
      borderRadius: '6px', padding: '5px 10px', position: 'absolute', zIndex: 1,
      bottom: '125%', left: '50%', transform: 'translateX(-50%)', opacity: 0, transition: 'opacity 0.3s',
      width: '200px', fontSize: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }} className="tooltip-text">
      {text}
    </div>
  </div>
);

export default function App() {
  const [sol, setSol] = useState(1);
  const [energyMax] = useState(100);
  const [systems, setSystems] = useState({
    lifeSupport: { name: 'Soporte Vital', cost: 40, active: true, icon: Wind, desc: 'Filtra CO2 y provee oxígeno. ¡Vital!' },
    agriculture: { name: 'Módulo Agrícola', cost: 50, active: true, icon: Sprout, desc: 'Cultivos hidropónicos. Si se apaga, las plantas se congelan.' },
    shields: { name: 'Escudos Anti-Radiación', cost: 60, active: false, icon: Shield, desc: 'Bloquea la radiación de tormentas solares.' }
  });
  const [solarStorm, setSolarStorm] = useState(false);
  const [message, setMessage] = useState("Día tranquilo en Marte. Gestiona la energía sabiamente.");
  const [blackout, setBlackout] = useState(false);

  const currentLoad = Object.values(systems).reduce((acc, sys) => sys.active ? acc + sys.cost : acc, 0);

  useEffect(() => {
    if (currentLoad > energyMax) {
      setBlackout(true);
      setMessage("¡APAGÓN GENERAL! Consumo excesivo. Apaga sistemas inmediatamente.");
    } else {
      setBlackout(false);
      if (solarStorm && !systems.shields.active) {
        setMessage("¡PELIGRO! Tormenta solar activa. Niveles de radiación críticos. ¡Enciende los escudos!");
      } else if (solarStorm && systems.shields.active) {
        setMessage("Tormenta solar contenida. Escudos operando al máximo.");
      } else {
        setMessage("Sistemas operando dentro de los parámetros normales.");
      }
    }
  }, [currentLoad, solarStorm, systems.shields.active]);

  const toggleSystem = (key) => {
    setSystems(prev => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active }
    }));
  };

    const nextSol = () => {
    setSol(prev => (prev < 10 ? prev + 1 : prev));
  };
  const triggerStorm = () => {
    setSolarStorm(true);
    setTimeout(() => setSolarStorm(false), 15000); // Storm lasts 15 seconds for demo
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e74c3c', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sun size={32} /> Simulador Base Marciana
        </h1>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          Sol {sol} / 10
        </div>
      </header>

      <div style={{ backgroundColor: blackout ? '#ffcccc' : '#f8f9fa', color: '#333', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: `5px solid ${blackout ? 'red' : '#3498db'}` }}>
        <p style={{ margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={20} /> {message}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#2c3e50', padding: '20px', borderRadius: '8px' }}>
        <div>
          <h2 style={{ margin: '0 0 10px 0', color: '#ecf0f1' }}>Carga de Energía</h2>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: currentLoad > energyMax ? '#e74c3c' : '#2ecc71' }}>
            {currentLoad} / {energyMax} kW
          </div>
        </div>
        <button onClick={triggerStorm} disabled={solarStorm} style={{ padding: '10px 20px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: solarStorm ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
          {solarStorm ? 'Tormenta en progreso...' : 'Simular Alerta DONKI (CME)'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        {Object.entries(systems).map(([key, sys]) => (
          <div key={key} style={{ backgroundColor: '#34495e', padding: '20px', borderRadius: '8px', border: `2px solid ${sys.active ? '#2ecc71' : '#7f8c8d'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <Tooltip text={sys.desc}>
                <h3 style={{ margin: 0, color: '#ecf0f1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <sys.icon size={24} /> {sys.name}
                </h3>
              </Tooltip>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#bdc3c7', marginBottom: '15px' }}>
              -{sys.cost} kW
            </div>
            <button 
              onClick={() => toggleSystem(key)}
              style={{ width: '100%', padding: '10px', backgroundColor: sys.active ? '#c0392b' : '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
              <Power size={18} /> {sys.active ? 'Apagar' : 'Encender'}
            </button>
          </div>
        ))}
      </div>

            <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <button
          onClick={nextSol}
          disabled={sol >= 10}
          style={{ padding: '15px 30px', fontSize: '20px', fontWeight: 'bold', backgroundColor: sol >= 10 ? '#7f8c8d' : '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: sol >= 10 ? 'not-allowed' : 'pointer' }}>
          Siguiente Sol ➜
        </button>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .group:hover .tooltip-text { visibility: visible !important; opacity: 1 !important; }
      `}} />
    </div>
  );
}
