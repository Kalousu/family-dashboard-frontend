# Plugin-Architektur — Family Dashboard

Diese Dokumentation beschreibt die Plugin-Architektur des Family Dashboards, erklärt welche Projektanforderungen wo und wie umgesetzt sind, und gibt Teammitgliedern einen schnellen Einstieg in die Codebasis.

---

## Inhaltsverzeichnis

1. [Architektur-Überblick](#1-architektur-überblick)
2. [Monorepo-Struktur](#2-monorepo-struktur)
3. [Plugin-Konzept: Widgets als unabhängige Pakete](#3-plugin-konzept-widgets-als-unabhängige-pakete)
4. [widget-core — Das Plugin-Framework](#4-widget-core--das-plugin-framework)
5. [Ein Widget implementieren](#5-ein-widget-implementieren)
6. [Widget im Dashboard registrieren](#6-widget-im-dashboard-registrieren)
7. [Anforderungs-Mapping](#7-anforderungs-mapping)
8. [Technologie-Entscheidungen](#8-technologie-entscheidungen)
9. [Lokale Entwicklung](#9-lokale-entwicklung)
10. [Konventionen & Clean Code](#10-konventionen--clean-code)

---

## 1. Architektur-Überblick

```
┌─────────────────────────────────────────────────────────────────┐
│                        apps/dashboard                           │
│   (React SPA – rendert das Grid, lädt Widgets via Registry)     │
└────────────────────────┬────────────────────────────────────────┘
                         │ importiert
         ┌───────────────┼───────────────────┐
         ▼               ▼                   ▼
 ┌───────────────┐ ┌───────────────┐ ┌──────────────────┐
 │ widget-core   │ │  widget-todo  │ │ widget-kalender  │ …
 │ (Framework)   │ │  (Plugin)     │ │ (Plugin)         │
 └───────────────┘ └───────────────┘ └──────────────────┘
         │
         ▼
 ┌───────────────┐  ┌────────────┐  ┌──────────────┐
 │  packages/ui  │  │  packages/ │  │  packages/   │
 │  (Shared UI)  │  │  auth      │  │  ...         │
 └───────────────┘  └────────────┘  └──────────────┘
```

**Kernprinzip:** Jedes Widget ist ein eigenständiges npm-Paket. Es kennt das Framework (`widget-core`), aber nicht das Dashboard oder andere Widgets. Das Dashboard kennt alle Widgets, weiß aber nichts über ihre interne Implementierung — es spricht nur gegen das `WidgetPlugin`-Interface.

---

## 2. Monorepo-Struktur

### Warum überhaupt ein Monorepo?

Das Backend (Java/Spring Boot) lebt in einem **separaten Repository** — das Monorepo betrifft ausschließlich den JavaScript/TypeScript-Anteil des Projekts.

Der Grund ist die Plugin-Architektur selbst: Das Frontend besteht nicht aus einer einzigen App, sondern aus **mehreren eigenständigen Paketen**:

```
packages/
├── widget-core/        # Framework — wird von allen Widgets importiert
├── widget-stundenplan/ # Plugin — eigenständiges Paket
├── widget-kalender/    # Plugin — eigenständiges Paket
├── widget-todo/        # Plugin — eigenständiges Paket
├── ui/                 # Shared Components
└── auth/               # Auth-Logik
```

Ohne Monorepo müssten alle diese Pakete **auf npm veröffentlicht** werden, damit `apps/dashboard` sie importieren kann — mit Versionsnummern, Publish-Schritten und ständiger Synchronisation. Das Monorepo mit npm Workspaces löst das elegant: Pakete werden direkt per `"@family-dashboard/widget-todo": "*"` referenziert, ohne Publishing.

### Monorepo vs. Docker — zwei verschiedene Ebenen

Monorepo und Docker lösen **unterschiedliche Probleme** und schließen sich nicht aus.

| Bereich | Monorepo | Docker |
|---|---|---|
| **Löst** | Code-Organisation während der Entwicklung | Deployment & Ausführung der App |
| **Betrifft** | Entwickler und IDE | Server und CI/CD |
| **Frage** | Wie liegt der Code zusammen? | Wie wird die App ausgeführt? |

Am Ende des Projekts werdet ihr wahrscheinlich beides haben:

```
Docker Container 1: React SPA        (aus diesem Repo, gebaut mit Vite)
Docker Container 2: Spring Boot API  (aus dem Backend-Repo)
Docker Container 3: PostgreSQL
```

Der Code für Container 1 liegt im Monorepo — Docker und Monorepo arbeiten auf verschiedenen Ebenen zusammen, nicht gegeneinander.

### Vor- und Nachteile

| Vorteil | Beschreibung |
|---|---|
| Kein npm-Publishing | Widget-Pakete direkt referenzierbar, kein Versioning-Overhead |
| Ein `npm install` | Neues Teammitglied: klonen + install, fertig |
| Atomare Commits | Änderungen über mehrere Pakete in einem einzigen Commit |
| Geteilte Konfiguration | Ein `.eslintrc`, ein `tsconfig`, ein `prettier` für alle Pakete |
| Turborepo-Caching | Nur geänderte Pakete werden neu gebaut |

| Nachteil | Beschreibung |
|---|---|
| Kein geteilter Code mit Backend | Da das Backend Java ist, können keine TypeScript-Typen geteilt werden — API-Verträge müssen manuell synchron gehalten werden |
| Repo wächst mit | Alle Widget-Pakete, alle Build-Artefakte im selben Repo |
| npm Workspaces-Eigenheiten | Gelegentliche Hoisting-Probleme bei Abhängigkeiten |

### Struktur

```
family-dashboard2/
├── apps/
│   └── dashboard/              # React SPA (Vite + React 19)
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   └── ...
│       ├── vite.config.ts      # Pfad-Aliase für alle Pakete
│       └── package.json
│
├── packages/
│   ├── widget-core/            # Plugin-Framework: Typen, Registry, Basis-Klasse
│   ├── widget-stundenplan/     # Plugin: Stundenplan (MUSS-Widget)
│   ├── widget-kalender/        # Plugin: Terminkalender
│   ├── widget-todo/            # Plugin: To-Do-Liste
│   ├── ui/                     # Geteilte React-Komponenten & Styles
│   └── auth/                   # Authentifizierung & Rollen-Logik
│
├── turbo.json                  # Turborepo Task-Pipeline
└── package.json                # npm workspaces root
```

**Warum Monorepo?**
Alle Pakete liegen im selben Repository → gemeinsames Versionieren, atomare Commits über Paketgrenzen hinweg, geteilte TypeScript-Konfiguration. Turborepo cached Build-Artefakte und führt Tasks parallel aus.

---

## 3. Plugin-Konzept: Widgets als unabhängige Pakete

### Grundidee

Jedes Widget folgt einem einheitlichen Vertrag (Interface), der in `widget-core` definiert ist. Das Dashboard lädt Widgets ausschließlich über dieses Interface — es weiß nicht, ob ein Widget einen Kalender oder eine To-Do-Liste anzeigt.

```
Dashboard
  └─ WidgetRegistry.register(stundenplanPlugin)
  └─ WidgetRegistry.register(kalenderPlugin)
  └─ WidgetRegistry.register(todoPlugin)
       └─ Widget rendert sich selbst
```

### Vorteile dieser Architektur

| Vorteil | Begründung |
|---|---|
| **Isolierung** | Ein fehlerhaftes Widget bringt nicht das Dashboard zum Absturz |
| **Unabhängige Teams** | Jedes Teammitglied kann an einem Widget-Paket arbeiten |
| **Austauschbarkeit** | Widgets können ohne Dashboard-Änderung ersetzt werden |
| **Testbarkeit** | Widgets sind reine React-Komponenten, isoliert testbar |
| **Erweiterbarkeit** | Neues Widget = neues Paket + Registrierung im Dashboard |

---

## 4. widget-core — Das Plugin-Framework

**Pfad:** [packages/widget-core/src/](../packages/widget-core/src/)

`widget-core` ist das Herzstück der Plugin-Architektur. Es definiert:

### 4.1 Das `WidgetPlugin`-Interface

```typescript
// packages/widget-core/src/types.ts

export type WidgetSize = 'small' | 'medium' | 'large'
export type UserRole = 'admin' | 'user' | 'sysadmin'

export interface WidgetConfig {
  /** Eindeutige ID dieser Widget-Instanz */
  id: string
  /** Spalte im Grid (0-basiert) */
  col: number
  /** Zeile im Grid (0-basiert) */
  row: number
  /** Größe des Widgets im Grid */
  size: WidgetSize
  /** Plugin-spezifische Einstellungen (frei definierbar) */
  settings: Record<string, unknown>
}

export interface WidgetPlugin {
  /** Eindeutiger Bezeichner des Plugins, z. B. "widget-todo" */
  readonly id: string
  /** Anzeigename in der Widget-Auswahl */
  readonly displayName: string
  /** Kurzbeschreibung für die UI */
  readonly description: string
  /** Welche Rollen dürfen dieses Widget sehen? */
  readonly allowedRoles: UserRole[]
  /** Standard-Größe beim Hinzufügen */
  readonly defaultSize: WidgetSize
  /** Rendert das Widget — erhält seine aktuelle Konfiguration */
  render(config: WidgetConfig): React.ReactElement
  /** Rendert das Konfigurations-Panel (optional) */
  renderConfig?(config: WidgetConfig, onChange: (next: WidgetConfig) => void): React.ReactElement
}
```

### 4.2 Die `WidgetRegistry`

```typescript
// packages/widget-core/src/registry.ts

class WidgetRegistry {
  private plugins = new Map<string, WidgetPlugin>()

  register(plugin: WidgetPlugin): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Widget "${plugin.id}" is already registered.`)
      return
    }
    this.plugins.set(plugin.id, plugin)
  }

  get(id: string): WidgetPlugin | undefined {
    return this.plugins.get(id)
  }

  getAll(): WidgetPlugin[] {
    return Array.from(this.plugins.values())
  }

  getForRole(role: UserRole): WidgetPlugin[] {
    return this.getAll().filter(p => p.allowedRoles.includes(role))
  }
}

export const widgetRegistry = new WidgetRegistry()
```

### 4.3 Public API von widget-core

```typescript
// packages/widget-core/src/index.ts
export type { WidgetPlugin, WidgetConfig, WidgetSize, UserRole } from './types'
export { widgetRegistry } from './registry'
```

---

## 5. Ein Widget implementieren

Hier am Beispiel `widget-todo`. Alle anderen Widgets folgen exakt demselben Schema.

**Pfad:** [packages/widget-todo/src/](../packages/widget-todo/src/)

```typescript
// packages/widget-todo/src/TodoWidget.tsx
import React, { useState } from 'react'
import type { WidgetConfig } from '@family-dashboard/widget-core'

interface Props {
  config: WidgetConfig
}

export function TodoWidget({ config }: Props) {
  const [items, setItems] = useState<string[]>(
    (config.settings.items as string[]) ?? []
  )

  return (
    <div className="todo-widget">
      <h3>To-Do</h3>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}
```

```typescript
// packages/widget-todo/src/index.ts
import React from 'react'
import type { WidgetPlugin } from '@family-dashboard/widget-core'
import { TodoWidget } from './TodoWidget'

export const todoPlugin: WidgetPlugin = {
  id: 'widget-todo',
  displayName: 'To-Do-Liste',
  description: 'Aufgaben verwalten für die ganze Familie',
  allowedRoles: ['admin', 'user'],
  defaultSize: 'medium',

  render(config) {
    return React.createElement(TodoWidget, { config })
  },

  renderConfig(config, onChange) {
    // Konfigurations-UI für dieses Widget
    return React.createElement('div', null, 'To-Do Einstellungen…')
  },
}
```

### Neue Widget-Pakete anlegen

1. Neues Paket-Verzeichnis unter `packages/widget-<name>/` anlegen
2. `package.json` mit Name `@family-dashboard/widget-<name>` erstellen
3. Plugin-Interface implementieren (siehe oben)
4. Paket-Alias in [apps/dashboard/vite.config.ts](../apps/dashboard/vite.config.ts) eintragen
5. Paket-Alias in [apps/dashboard/tsconfig.json](../apps/dashboard/tsconfig.json) eintragen
6. Plugin im Dashboard registrieren (siehe Abschnitt 6)

---

## 6. Widget im Dashboard registrieren

```typescript
// apps/dashboard/src/main.tsx
import { widgetRegistry } from '@family-dashboard/widget-core'
import { stundenplanPlugin } from '@family-dashboard/widget-stundenplan'
import { kalenderPlugin } from '@family-dashboard/widget-kalender'
import { todoPlugin } from '@family-dashboard/widget-todo'

// Alle Plugins einmalig beim App-Start registrieren
widgetRegistry.register(stundenplanPlugin)
widgetRegistry.register(kalenderPlugin)
widgetRegistry.register(todoPlugin)
```

Das Dashboard fragt die Registry zur Laufzeit ab:

```typescript
// apps/dashboard/src/components/WidgetGrid.tsx
import { widgetRegistry } from '@family-dashboard/widget-core'
import { useAuth } from '@family-dashboard/auth'

export function WidgetGrid() {
  const { currentUser } = useAuth()
  const availablePlugins = widgetRegistry.getForRole(currentUser.role)

  return (
    <div className="widget-grid">
      {availablePlugins.map(plugin =>
        plugin.render(/* aktuelle WidgetConfig aus dem State */)
      )}
    </div>
  )
}
```

---

## 7. Anforderungs-Mapping

Die folgende Tabelle zeigt, **wo** jede Anforderung aus dem Pflichtenheft **umgesetzt** ist.

### Widget-System

| Anforderung | Umsetzung | Datei/Paket |
|---|---|---|
| Modulares Widget-System | Plugin-Interface + Registry | `packages/widget-core/` |
| Stundenplan (MUSS) | `stundenplanPlugin` | `packages/widget-stundenplan/` |
| Terminkalender | `kalenderPlugin` | `packages/widget-kalender/` |
| To-Do-Liste | `todoPlugin` | `packages/widget-todo/` |
| Widgets hinzufügen/entfernen | Dashboard-State + Registry | `apps/dashboard/src/` |
| Widget-Positionierung | Grid-Layout mit col/row im `WidgetConfig` | `packages/widget-core/src/types.ts` |
| Widget individuell konfigurierbar | `renderConfig()` im WidgetPlugin | `packages/widget-core/src/types.ts` |

### Rollenkonzept

| Anforderung | Umsetzung | Datei/Paket |
|---|---|---|
| Rollen: admin, user, sysadmin | `UserRole`-Typ | `packages/widget-core/src/types.ts` |
| Widget-Berechtigungen | `allowedRoles[]` pro Plugin + `getForRole()` | `packages/widget-core/src/registry.ts` |
| Authentifizierung & Session | Auth-Paket | `packages/auth/` |
| Benutzer verwalten | Admin-UI + Auth-API | `packages/auth/` + Backend |
| Admin: Widgets konfigurieren | `renderConfig()` nur für Admin sichtbar | `apps/dashboard/src/` |

### Nicht-funktionale Anforderungen

| Anforderung | Umsetzung | Datei/Paket |
|---|---|---|
| Responsive Design | CSS Grid + Media Queries | `packages/ui/src/styles/` |
| SPA Frontend | Vite + React 19 | `apps/dashboard/` |
| Getrennte Pakete (Frontend/Backend) | Monorepo-Struktur | Root + `apps/` + `packages/` |
| State Management Frontend | React Context + Zustand | `apps/dashboard/src/` |
| Modulare Architektur | Plugin-Pakete je Widget | `packages/widget-*/` |
| Plugin-Architektur | WidgetPlugin-Interface + Registry | `packages/widget-core/` |
| Klare Schnittstellen | TypeScript-Interfaces | `packages/widget-core/src/types.ts` |
| Erweiterbarkeit | Neues Widget = neues Paket | Konvention, keine Änderung am Core nötig |

### Technische Anforderungen

| Anforderung | Umsetzung | Detail |
|---|---|---|
| React SPA | Vite 7 + React 19 + TypeScript | `apps/dashboard/` |
| Responsive UI-Framework | Tailwind CSS / eigenes CSS-System | `packages/ui/` |
| RESTful API Backend | Node.js / Express (noch zu implementieren) | `apps/api/` (geplant) |
| Datenbank | PostgreSQL / Prisma (noch zu implementieren) | Backend |
| Build-Pipeline | Turborepo mit parallelen Tasks | `turbo.json` |

---

## 8. Technologie-Entscheidungen

### Turborepo als Monorepo-Manager

**Warum:** Turborepo cached Builds auf Task-Ebene. Wird nur `widget-todo` geändert, werden nur dessen abhängige Tasks neu ausgeführt. Das spart in CI/CD und lokal erheblich Zeit. Alternative wäre Nx — Turborepo ist schlanker und hat weniger Konfigurationsaufwand.

### Vite als Build-Tool

**Warum:** Vite nutzt native ES Modules im Dev-Server (kein Bundle → blitzschnelles HMR) und Rollup für Production-Builds. Für React 19 mit TypeScript ist es der Standard. Alternative wäre Webpack — deutlich langsamer.

### React 19 + TypeScript

**Warum:** React 19 bringt Server Components, verbesserte Suspense-Integration und den neuen `use()`-Hook. TypeScript erzwingt typsichere Plugin-Interfaces — ohne es wäre die Plugin-Architektur fehleranfällig.

### npm Workspaces statt yarn/pnpm

**Warum:** npm Workspaces sind seit npm 7 stabil und erfordern keine zusätzliche Installation. Für dieses Projekt ausreichend.

### Pfad-Aliase in Vite + tsconfig

**Warum:** `@family-dashboard/widget-todo` wird im Dev-Modus direkt auf den Quellcode gemappt — kein Build der Pakete nötig. Das beschleunigt die Entwicklung massiv. In [vite.config.ts](../apps/dashboard/vite.config.ts) und [tsconfig.json](../apps/dashboard/tsconfig.json) sind die Aliase synchron gepflegt.

---

## 9. Lokale Entwicklung

### Voraussetzungen

- Node.js >= 18
- npm >= 11 (wird mit Node 18+ mitgeliefert)

### Setup

```bash
# Repository klonen
git clone <repo-url>
cd family-dashboard2

# Alle Abhängigkeiten installieren (alle Workspaces)
npm install

# Dev-Server starten (Dashboard auf http://localhost:3000)
npm run dev

# Nur ein bestimmtes Paket entwickeln
npx turbo run dev --filter=dashboard

# Typen prüfen
npm run check-types

# Alle Pakete bauen
npm run build

# Code formatieren
npm run format
```

### Ein neues Widget entwickeln

```bash
# 1. Paket-Verzeichnis anlegen
mkdir -p packages/widget-mein-widget/src

# 2. package.json erstellen
cat > packages/widget-mein-widget/package.json << 'EOF'
{
  "name": "@family-dashboard/widget-mein-widget",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "exports": { ".": "./src/index.ts" }
}
EOF

# 3. Plugin implementieren (siehe Abschnitt 5)
# 4. Alias in vite.config.ts + tsconfig.json eintragen
# 5. Plugin in apps/dashboard/src/main.tsx registrieren
# 6. npm install (damit der neue Workspace erkannt wird)
npm install
```

---

## 10. Konventionen & Clean Code

### Paket-Benennung

| Typ | Schema | Beispiel |
|---|---|---|
| Widget-Plugin | `@family-dashboard/widget-<name>` | `@family-dashboard/widget-todo` |
| Plugin-Export | `<Name>Plugin` (camelCase) | `todoPlugin` |
| Widget-Komponente | `<Name>Widget` | `TodoWidget` |

### TypeScript

- Alle öffentlichen Interfaces in `widget-core/src/types.ts` definieren
- Keine `any`-Typen — `unknown` mit Type Guard verwenden
- `WidgetConfig.settings` ist `Record<string, unknown>`, Widget castet intern

### React

- Funktionale Komponenten, keine Class Components
- Props-Interface direkt vor der Komponente definieren
- State nur so weit oben halten wie nötig (Lifting State Up)

### Commits

```
feat(widget-todo): add item sorting by priority
fix(widget-core): prevent duplicate plugin registration
refactor(dashboard): extract WidgetGrid into own component
```

Format: `<type>(<scope>): <beschreibung>` — Scope ist das betroffene Paket.
