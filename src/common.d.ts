declare global {
  interface Window {
    // Matomo
    _paq: [string, ...unknown[]][];
  }
}

export {};
