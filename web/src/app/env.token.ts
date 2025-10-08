import { InjectionToken } from '@angular/core';

export type Env = { apiBaseUrl: string };

export const ENV = new InjectionToken<Env>('ENV', {
  factory: () => ({
    // Default for local dev; override at runtime via window.__env in index.html if needed
    apiBaseUrl: (window as any).__env?.apiBaseUrl ?? 'http://localhost:5000'
  })
});
