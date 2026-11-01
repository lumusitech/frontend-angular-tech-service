# Próximo paso — UI/UX mobile-first y tenancy real

> Documento de arranque para la siguiente etapa del proyecto. No es código ni
> un plan cerrado: es el encuadre de tres líneas de trabajo que se deben
> **investigar y acotar** antes de implementar.
>
> **Contexto:** el núcleo funcional está completo (CRUDs, work orders, billing,
> portal, offline PWA, kanban, bulk actions, i18n ES/EN/PT, 879+ tests, E2E
> 60/60). El siguiente salto de valor no es más funcionalidad, es **fricción de
> uso** y **modelo de negocio**. Escribir menos features y pulir más.

---

## 0. Resumen de las tres líneas

| # | Línea | Tipo | Prioridad sugerida |
| - | ----- | ---- | ------------------ |
| A | Revisión y mejora UI/UX (mobile-first PWA + desktop) | Ejecución + investigación de métricas | 🔴 Alta |
| B | Tenancy real (multi-cliente) | **Investigación de negocio** antes de tocar código | 🟠 Media (bloquea decisiones de A) |
| C | Perfil de técnico: foto + emoji picker nativo | Ejecución acotada | 🟡 Baja-media |

**Dependencia importante:** A y B no son independientes. Cuánto puede
customizar cada cliente (colores, fuentes, iconos, banners) depende de si el
producto es SaaS multi-tenant o "una app por cliente". **Resolver la pregunta de
B primero evita rehacer A.**

---

## A. Revisión y mejora UI/UX

### A.1 Objetivo

Auditar y unificar la experiencia en las **pantallas críticas**, priorizando
**mobile-first / PWA** (el técnico trabaja desde el celular, muchas veces sin
señal) **sin descuidar desktop** (admin). Buscar coherencia y consistencia, no
rediseñar por rediseñar.

### A.2 Problemas detectados (a confirmar en la auditoría)

- **Incoherencia de tamaños de íconos:** hay íconos demasiado chicos en algunos
  lugares y demasiado grandes en otros. No existe una escala única de tamaños
  por tipo de superficie (acción, navegación, decorativo, estado).
- **Touch targets chicos:** botones/íconos por debajo del mínimo táctil
  recomendado en vistas de campo.
- **Desalineaciones:** elementos con posiciones difíciles de alcanzar con el
  pulgar (fuera de la zona natural en mobile).
- **Proporción texto ↔ ícono:** falta una regla clara de tamaño de texto y de
  ícono según breakpoint y jerarquía.
- **Fuente de marca:** hoy se usa Inter + JetBrains Mono genéricas. No hay una
  tipografía con identidad propia ni un sistema tipográfico documentado.

### A.3 Métricas y estándares modernos a investigar

Referencias a comparar antes de decidir (no inventar; citar fuente):

- **Touch targets:** WCAG 2.2 SC 2.5.8 (mínimo 24×24 CSS px) vs. mínimo
  recomendado de 44–48 px. Material Design 3 y Apple HIG.
- **Escala de íconos:** sistema de tamaños (p. ej. 16/20/24/32/40) mapeado a
  contextos de uso, con regla de "un ícono de acción principal = tamaño táctil
  completo, un ícono inline = tamaño de texto".
- **Escala tipográfica:** modular scale (ratio 1.2 / 1.25), tamaños mínimos
  legibles en campo (>= 16px body en mobile para evitar zoom en inputs).
- **Espaciado:** base 4/8px, tokens de spacing consistentes.
- **Zona de pulgar (thumb zone):** qué acciones van al alcance natural del
  pulgar en mobile y cuáles pueden requerir estirar la mano.
- **Densidad:** mobile = baja densidad (más aire), desktop = mayor densidad.

Entregable: una tabla de decisiones ("token → valor → justificación → fuente")
antes de tocar componentes.

### A.4 Pantallas críticas a priorizar (propuesta)

Ordenar por impacto de uso real, no por cantidad de líneas:

1. **Detalle de orden — vista técnico** (`features/technician/tech-work-order-detail.component.ts`)
   — es el corazón del trabajo en campo: tareas, materiales, notas, transición
   de estado. Ya tuvo un rediseño mobile (BUG-005 / FEAT-007), revisar si quedó
   coherente con el nuevo sistema.
2. **Lista de órdenes del técnico** (`features/technician/`) — cards de urgencia.
3. **Detalle de orden — admin** (`features/work-orders/work-order-detail.component.ts`).
4. **Listas con `mobile-card`** — touch targets, swipe, acciones de fila.
5. **Kanban** (`/admin/work-orders/kanban`) — drag & drop en touch.
6. **Portal de tracking** (`/track`), SSR público, mobile-first.

### A.5 Nueva fuente de marca (investigar)

- Candidatas a evaluar (cargar, comparar en tamaños reales, medir legibilidad):
  Geist, Satoshi, Manrope, Plus Jakarta Sans, Figtree, Outfit, General Sans.
- Requisitos: familia con buenos pesos (400–700), legible en mobile a 16px,
  buen rendering en dark mode, alternativa/pairing monoespaciada para códigos
  de tracking (`TS-XXXXX`) — hoy JetBrains Mono.
- Definir: escala tipográfica, pesos permitidos, line-height por tamaño, fallback
  del sistema.

### A.6 Entregables de la línea A

- [ ] Inventario de tamaños actuales de íconos y texto por pantalla crítica.
- [ ] Tabla de decisiones de tokens (íconos, tipografía, espaciado, targets).
- [ ] Guía de fuentes candidatas con muestra comparativa.
- [ ] Refactor acotado de las pantallas críticas (empezar por la vista técnico).
- [ ] Verificación en dispositivo real (no solo desktop/emulador).

---

## B. Tenancy real — investigación de modelo de negocio

### B.1 Estado actual (confirmado en código)

- `BusinessSettingsService` (`src/app/core/services/business-settings.service.ts`)
  consume `GET/PATCH /api/business-settings`, un **único registro global** con:
  `businessName`, `logoUrl`, `primaryColor`, `secondaryColor`, `address`,
  `phone`, `email`.
- La UI de "Multi-tenant" que describe la doc (ROADMAP, README, landing
  `multiTenant` feature) **es sólo personalización de preferencias de una sola
  empresa**, aplicada como CSS variables desde `app.ts`. No hay `tenantId` ni
  aislamiento de organizaciones.
- Conclusión: **no es multi-tenant real**. Es configuración de branding.

### B.2 La pregunta de negocio (responder ANTES de codificar)

> ¿El producto se vende como **SaaS multi-tenant** (una app, N empresas, cada
> usuario ve solo la suya) o como **una app desplegada por cliente**
> (single-tenant: cada cliente customiza su instancia: colores, fuentes,
> iconos, banners, nombre, etc.)?

Comparar dos modelos:

| Modelo | Descripción | Implica |
| ------ | ----------- | ------- |
| **A. SaaS multi-tenant** | Una sola app/deploy, N organizaciones con aislamiento (tenantId en token, scoping en queries). | Backend con tenant context, guard de aislamiento, onboarding de empresas, billing por cliente. Complejidad alta. |
| **B. Single-tenant por cliente** | Un deploy por cliente (Firebase/Vercel), cada uno con su config/branding. | Sólo hay que ampliar la config de branding + pipeline de deploy/customización. Mucho menos complejidad. |

### B.3 Hipótesis y consideraciones

- Dado el modelo actual (backend NestJS con un único `business-settings`), y el
  perfil de clientes (negocios locales, ~8 usuarios/día), **el modelo B parece
  el ajuste natural hoy**: desplegar una app por cliente y dejar que customice.
- Si es así, "hacer la app tenant de verdad" se traduce en **extender la
  customización por instancia** (colores, fuente, logo, iconos, banners, nombre)
  y un **proceso de deploy por cliente**, no en un motor multi-tenant en runtime.
- Si el negocio quiere escalar a muchas empresas sin re-desplegar, recién ahí
  vale el modelo A (complejidad alta, decidir con datos).

### B.4 Entregables de la línea B

- [ ] Decisión documentada del modelo de negocio (A vs. B) con justificación.
- [ ] Si B: alcance de customización por instancia + proceso de deploy.
- [ ] Si A: diseño de aislamiento (tenant context, scoping, guards, onboarding).
- [ ] Impacto sobre el branding de la línea A (¿el cliente elige fuente/colores?).

---

## C. Perfil de técnico: foto y emoji picker

### C.1 Estado actual (confirmado en código)

- El avatar de usuario es un `string` (`user.interfaces.ts`, `auth.interfaces.ts`,
  `profile.service.ts`) que puede ser **emoji** o **data URL base64**.
- `profile-settings.component.ts` tiene un picker con **18 emojis hardcodeados**
  (`AVATAR_EMOJIS`, líneas 16–35) y además permite subir una foto que se
  convierte a data URL en el cliente.
- Renderizado en `header.component.ts` y `tech-layout.component.ts`: si el
  avatar empieza con `data:` se muestra `<img>`, si no, se muestra el emoji.

### C.2 Objetivos

1. **Foto de técnico real:** mejorar la carga/recorte/ formato de imagen
   (hoy data URL base64 en la entidad de usuario). Evaluar:
   - Recorte circular / preview antes de guardar.
   - Tamaño y compresión (evitar base64 gigante en la BD).
   - Alternativa a data URL: subida a storage y guardar URL (requiere backend).
2. **Emoji picker nativo:** no limitar a 18 emojis. Evaluar integración del
   **picker de emojis del dispositivo** (el nativo del SO, p. ej. el panel del
   teclado) o una librería de picker completo, en lugar de una lista hardcodeada.

### C.3 Entregables de la línea C

- [ ] Decisión de almacenamiento de imagen (data URL vs. storage + URL).
- [ ] UX de carga de foto (preview, recorte, límite de tamaño, formatos).
- [ ] Reemplazo del picker hardcodeado por acceso al picker nativo o librería.
- [ ] Actualización de `header`, `tech-layout` y cualquier lista que muestre
      técnicos (kanban muestra avatares).

---

## D. Orden sugerido

1. **Resolver B** (aunque sea una decisión escrita de 1 página). Bloquea el
   alcance de customización de A.
2. **Auditoría UI/UX + tabla de tokens** (A.3–A.5). Sin cambios de código aún.
3. **Refactor de la pantalla crítica #1** (detalle de orden técnico).
4. **Extender al resto de pantallas críticas.**
5. **C** en paralelo si se libera capacidad (es acotada e independiente).
6. Deploy alpha + validación con técnicos reales.

---

## E. Criterios de aceptación globales

- Ningún touch target interactivo por debajo del mínimo acordado.
- Escala única de íconos y de tipografía aplicada y documentada.
- Coherencia visual entre mobile y desktop (misma jerarquía, distinta densidad).
- Verificación en dispositivo real, no sólo build o emulador.
- `npx ng build` sin errores (ignorar el de prerender `/` pre-existente) y
  `pnpm test` en verde tras cada cambio.

---

## F. Preguntas abiertas

1. ¿SaaS multi-tenant o una app por cliente? (bloqueante para A)
2. ¿Cuáles son las 2–3 pantallas que más usa el técnico en el día a día?
3. ¿Hay presupuesto/tiempo para una fuente de marca licenciada o se prioriza
   una open source (Google Fonts / Fontshare)?
4. ¿La foto de técnico debe persistirse en storage real o alcanza data URL?
5. ¿El cliente final (dueño del negocio) elige fuente/colores/iconos, o lo
   define el equipo que despliega?
