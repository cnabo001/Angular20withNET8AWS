import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ENV } from './env.token';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const { apiBaseUrl } = inject(ENV);
  const envBase = (window as any).__env?.apiBaseUrl;
  if (envBase && !/^https?:\/\//i.test(req.url)) {
    req = req.clone({
      url: envBase.replace(/\/$/, '') + '/' + req.url.replace(/^\//, '')
    });
  }
  return next(req);
};
