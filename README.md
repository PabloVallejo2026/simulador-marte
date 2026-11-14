# Proyecto: Simulador de Supervivencia Marciana 🚀
**NASA Space Apps Challenge 2026**

Este repositorio contiene el prototipo jugable para el desafío de creación de juegos educativos enfocados en los "trade-offs" (compensaciones) de ingeniería para la supervivencia en el espacio profundo.

## Arquitectura y Lógica (La "Manta Corta")
El juego está inspirado en *Oxygen Not Included*. La base marciana tiene un generador que produce un máximo de **100 kW**.
- **Soporte Vital (40 kW):** Imprescindible. Si se apaga mucho tiempo, se pierde la partida.
- **Módulo Agrícola (50 kW):** Provee comida.
- **Escudos (60 kW):** Protegen de la radiación.

**El conflicto:** 40 + 50 + 60 = 150 kW. No se puede tener todo encendido.
Cuando se detecta una tormenta solar, el jugador debe decidir qué sistema sacrificar (generalmente la agricultura) para encender los escudos sin provocar un apagón masivo.

## Integración con APIs de la NASA
- **DONKI (Space Weather Database):** Utilizamos datos de Eyecciones de Masa Coronal (CME) para disparar los eventos de tormenta solar en el juego.
- **OSDR / RadLab:** (Planificado) Reflejar los daños por dosis de radiación en la salud de la tripulación.

## Cómo correr el proyecto localmente
1. Instalar dependencias: `npm install`
2. Correr entorno de desarrollo: `npm run dev`
3. Abrir en el navegador (usualmente `http://localhost:5173`)
