// Textos del juego en español e inglés.
// Español: textos educativos de Soledad (responsable pedagógica), sujetos a su revisión final.
// Inglés: BORRADOR traducido con IA (Claude), pendiente de revisión por el equipo.

export const TEXTOS = {
  es: {
    reportTitle: 'Reporte del Sol',
    stormShields: 'Los escudos protegieron a la tripulación durante el evento solar. Administraste la energía para priorizar su seguridad.',
    stormNoShields: 'La tripulación quedó expuesta al peligro de radiación. Durante una emergencia solar, la protección es fundamental.',
    agricultureOn: 'El módulo agrícola continúa produciendo alimentos para mantener las reservas de la tripulación.',
    agricultureOff: 'Al apagar la agricultura, ahorraste energía, pero disminuyeron las reservas de alimentos. Una decisión puede tener consecuencias futuras.',
    lifeSupportOff: 'El sistema de soporte vital es indispensable para mantener el aire respirable. Apagarlo pone en riesgo a la tripulación.',
    calmDay: 'Hoy no hubo una emergencia solar. Podés aprovechar para administrar los recursos y prepararte para futuras amenazas.',
    health: 'Salud',
    food: 'Comida',
    noChange: 'sin cambios',
    noRadiationDamage: 'Sin daño por radiación',
    simplified: 'Valores simplificados del juego (no son mediciones de NASA).',
    // --- Pantalla de inicio: TEXTOS ORIGINALES de Soledad ---
    introTitle: 'MISIÓN MARTE: ¡BASE DE SUPERVIVENCIA!',
    introQuestion: '¿Tenés lo necesario para sobrevivir en el planeta rojo?',
    introText: 'Sos el comandante de una base en Marte. Tu misión es proteger a tu tripulación, administrar la energía y superar los peligros del clima espacial.',
    introPhrase: '¡Cada decisión cuenta. La supervivencia está en tus manos!',
    // --- Pantalla de inicio: ADAPTACIÓN NUEVA (Claude), pendiente de revisión de Soledad ---
    introEnergy: 'Tu generador produce 100 kW, pero los tres módulos necesitan 150 kW. No podés encenderlo todo.',
    introStorms: 'Durante la misión llegarán varias tormentas solares seguidas, según datos reales de NASA. Si encendés los escudos, tenés que apagar la agricultura y la comida baja. No vas a poder bloquearlas todas: elegí cuándo proteger y cuándo arriesgar.',
    introGoal: 'Objetivo: llegar al Sol 10 con salud y comida por encima de 0 %.',
    startButton: 'COMENZAR MISIÓN ➜',
    // --- Alerta de tormenta: ADAPTACIÓN NUEVA (Claude), pendiente de revisión de Soledad ---
    // Los valores (-20 % y -40 %) son los de las Reglas v2.
    stormAlertTitle: '¡Hoy llega una tormenta solar!',
    stormAlertData: 'Datos reales de NASA DONKI: {n} {cme} de masa coronal con llegada estimada a Marte este día.',
    cmeOne: 'eyección',
    cmeMany: 'eyecciones',
    stormOptionShields: 'Con escudos: la tripulación está protegida, pero tenés que apagar la agricultura (Comida −20 %).',
    stormOptionNoShields: 'Sin escudos: hay cosecha, pero la radiación baja la salud (Salud −40 %).'
  },
  en: {
    reportTitle: 'Sol Report',
    stormShields: 'The shields protected the crew during the solar event. You managed the energy to put their safety first.',
    stormNoShields: 'The crew was exposed to dangerous radiation. During a solar emergency, protection is essential.',
    agricultureOn: 'The farm module keeps growing food to maintain the crew\'s supplies.',
    agricultureOff: 'By turning off the farm, you saved energy, but the food supplies went down. A decision can have future consequences.',
    lifeSupportOff: 'The life support system is essential to keep the air breathable. Turning it off puts the crew at risk.',
    calmDay: 'There was no solar emergency today. Use this time to manage your resources and get ready for future threats.',
    health: 'Health',
    food: 'Food',
    noChange: 'no change',
    noRadiationDamage: 'No radiation damage',
    simplified: 'Simplified game values (not NASA measurements).',
    // --- Start screen: Soledad's original texts, AI DRAFT translation ---
    introTitle: 'MISSION MARS: SURVIVAL BASE!',
    introQuestion: 'Do you have what it takes to survive on the red planet?',
    introText: 'You are the commander of a base on Mars. Your mission is to protect your crew, manage the energy and overcome the dangers of space weather.',
    introPhrase: 'Every decision counts. Survival is in your hands!',
    introEnergy: 'Your generator produces 100 kW, but the three modules need 150 kW. You can\'t turn everything on.',
    introStorms: 'During the mission, several solar storms will arrive in a row, based on real NASA data. If you turn on the shields, you must turn off the farm and food goes down. You won\'t be able to block them all: choose when to protect and when to take the risk.',
    introGoal: 'Goal: reach Sol 10 with health and food above 0 %.',
    startButton: 'START MISSION ➜',
    stormAlertTitle: 'A solar storm arrives today!',
    stormAlertData: 'Real NASA DONKI data: {n} coronal mass {cme} estimated to reach Mars on this day.',
    cmeOne: 'ejection',
    cmeMany: 'ejections',
    stormOptionShields: 'With shields: the crew is protected, but you must turn off the farm (Food −20 %).',
    stormOptionNoShields: 'Without shields: you get a harvest, but radiation lowers health (Health −40 %).'
  }
};