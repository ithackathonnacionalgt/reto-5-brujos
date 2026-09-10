# AGENTS.md — reto-5-brujos (MultaClara)

Guía para agentes de IA y humanos que trabajan en este repo.

## Stack

- Vite + React (JavaScript, no TypeScript)
- Tailwind CSS v4 (plugin `@tailwindcss/vite`, sin tailwind.config)
- shadcn/ui (componentes en `src/components/ui/`, alias `@/` → `src/`)
- react-router-dom (HashRouter)
- PWA: Service Worker (`public/sw.js`) + manifest (`public/manifest.json`) + iconos PNG
- Deploy: Cloudflare Pages

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo
npm run build      # build de producción (dist/)
npm run preview    # previsualizar el build
```

## Estructura

```
src/
├── main.jsx              Bootstrap
├── App.jsx               Router (HashRouter) — agrega rutas aquí
├── index.css             Tailwind v4 (@import "tailwindcss")
├── lib/
│   ├── constantes.js     Plazos legales (15/60/120) — UNA fuente de verdad
│   ├── core.js           Lógica pura (semáforo, fechas, validación) — sin React
│   ├── data.js           Carga de infracciones.json + entidades.json
│   ├── utils.js          cn() de shadcn
│   └── i18n/
│       ├── index.js      Contexto React (useI18n, t())
│       ├── es.json       Traducciones español
│       ├── kiche.json    Traducciones K'iche'
│       └── kawchiquel.json Traducciones Kawchiquel
├── hooks/
│   └── useLocalStorage.js  Persistencia local
├── components/
│   ├── ui/               shadcn (NO editar a mano; usar npx shadcn add)
│   └── IdiomaSelector.jsx
└── screens/
    ├── Home.jsx          P0: Landing + placa + idioma
    ├── Placas.jsx        P0.5: Selección de placa (localStorage)
    ├── Municipios.jsx    P0.2c: Vista municipalidades (gris/color)
    ├── Form.jsx          P1: Formulario de boleta
    ├── Explicador.jsx    P2: Explicador + botones "?"
    ├── Semaforo.jsx      P3: Semáforo de legalidad
    ├── QueHago.jsx       P3.5: Pagar / oposición / prescripción
    └── Accion.jsx        P4: PDF / pago
public/
├── infracciones.json     Catálogo (fuente: LosBrujos/data/infracciones.json)
├── entidades.json        Placeholder — Diego completa
└── favicon.svg
data/
└── plantilla-impugnacion.md
```

## Reglas (ver ARQUITECTURA-DATOS.md en repo LosBrujos)

1. **Una sola fuente de verdad**: plazos en `constantes.js`, montos en `infracciones.json`, textos en i18n. NUNCA hardcodear en componentes.
2. **camelCase** para variables/funciones, **PascalCase** para componentes, **UPPER_SNAKE_CASE** para constantes, **kebab-case** para IDs/archivos JSON.
3. **i18n**: la UI nunca tiene texto directo — siempre `t('clave')`. Al agregar una clave, agregarla en los 3 JSON.
4. **core.js** es lógica pura (sin React, sin JSX) — testeable.
5. **Git**: cada uno trabaja en SU rama (`kevin-frontend`, `lemus-logica`, `diego-investigador`, `uriel-disenador`). NUNCA push directo a main — main solo lo toca André.

## TODO pendientes (por rol)

- **Kevin**: pulir screens, responsive mobile-first, tema oscuro, botones "?" en todo
- **Lemus**: conectar `core.js` con screens reales, cargar `infracciones.json` en Form/Explicador, PDF con jsPDF, Google Sheets + Apps Script
- **Diego**: completar `public/entidades.json` (11 entidades), copy de infracciones
- **Uriel**: traducciones reales K'iche' + Kawchiquel, paleta, iconos SVG, QA visual
- **André**: deploy Cloudflare Pages