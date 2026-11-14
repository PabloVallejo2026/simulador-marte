// Datos reales de NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information)
// Fuente: CCMC / NASA Goddard - consulta CME del 2024-05-14 al 2024-05-23 via api.nasa.gov/DONKI/CME
// Criterio: cada CME se asigna al dia (UTC) de su primera llegada a Marte estimada por el modelo
// WSA-ENLIL en sus analisis "mas precisos" (sin contar impactos "de refilon").
// Importante: son llegadas ESTIMADAS por un modelo, no mediciones en Marte.
// Cada Sol del juego corresponde a un dia de ese periodo (simplificacion educativa).

export const DONKI_SOURCE = {
  name: 'NASA DONKI (CCMC, NASA Goddard)',
  query: 'https://api.nasa.gov/DONKI/CME?startDate=2024-05-14&endDate=2024-05-23',
  page: 'https://ccmc.gsfc.nasa.gov/tools/DONKI',
  period: '14 al 23 de mayo de 2024'
};

export const DONKI_SOLS = [
  { sol: 1, date: '2024-05-14', label: '14 de mayo de 2024', marsCMEs: 0, maxSpeedKmS: 0, links: [] },
  { sol: 2, date: '2024-05-15', label: '15 de mayo de 2024', marsCMEs: 0, maxSpeedKmS: 0, links: [] },
  { sol: 3, date: '2024-05-16', label: '16 de mayo de 2024', marsCMEs: 1, maxSpeedKmS: 2225, links: ['https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30867/-1'] },
  { sol: 4, date: '2024-05-17', label: '17 de mayo de 2024', marsCMEs: 6, maxSpeedKmS: 1766, links: ['https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30891/-1', 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30923/-1'] },
  { sol: 5, date: '2024-05-18', label: '18 de mayo de 2024', marsCMEs: 2, maxSpeedKmS: 676, links: ['https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30841/-1', 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30844/-1'] },
  { sol: 6, date: '2024-05-19', label: '19 de mayo de 2024', marsCMEs: 4, maxSpeedKmS: 1452, links: ['https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30936/-1', 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30959/-1'] },
  { sol: 7, date: '2024-05-20', label: '20 de mayo de 2024', marsCMEs: 3, maxSpeedKmS: 1134, links: ['https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30974/-1', 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/30980/-1'] },
  { sol: 8, date: '2024-05-21', label: '21 de mayo de 2024', marsCMEs: 0, maxSpeedKmS: 0, links: [] },
  { sol: 9, date: '2024-05-22', label: '22 de mayo de 2024', marsCMEs: 0, maxSpeedKmS: 0, links: [] },
  { sol: 10, date: '2024-05-23', label: '23 de mayo de 2024', marsCMEs: 0, maxSpeedKmS: 0, links: [] },
];