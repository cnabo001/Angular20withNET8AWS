import { ApplicationConfig, 
  provideBrowserGlobalErrorListeners, 
  provideZonelessChangeDetection } from '@angular/core';
  import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { apiBaseUrlInterceptor } from './api-base-url.interceptor';
import { provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch(), withInterceptors([apiBaseUrlInterceptor]))
  ]
};
