import { createContext, useContext, useState } from 'react';

// Jedes Layout definiert wie viele Einheitsspalten das Grid hat.
// Widgets nehmen immer die gleiche Anzahl Einheiten ein (SIZE_SPANS),
// die Anzahl Widgets pro Reihe ändert sich je nach Layout.
//
// Um ein neues Layout hinzuzufügen: einfach Objekt in LAYOUTS ergänzen.
export const LAYOUTS = {
  standard: { id: 'standard', label: 'Standard',  cols: 6 }, // 3 medium pro Reihe
  compact:  { id: 'compact',  label: 'Kompakt',   cols: 8 }, // 4 medium pro Reihe
  wide:     { id: 'wide',     label: 'Weit',      cols: 4 }, // 2 medium pro Reihe
};

// Wie viele Grid-Einheiten ein Widget einnimmt (colSpan x rowSpan)
export const SIZE_SPANS = {
  small:  { colSpan: 2, rowSpan: 1 },
  medium: { colSpan: 2, rowSpan: 2 },
  large:  { colSpan: 4, rowSpan: 2 },
};

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [layout, setLayout] = useState(LAYOUTS.standard);
  return (
    <LayoutContext.Provider value={{ layout, setLayout, layouts: LAYOUTS }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
