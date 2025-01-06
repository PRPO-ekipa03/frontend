import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Paths to exclude from the interceptor
  const excludedPaths = ['/auth'];

  if (excludedPaths.some(path => req.url.includes(path))) {
    return next(req); // Pass through without modifying the request
  }

  // Read token from local storage
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  
  // If no token, just forward the original request
  return next(req);
};
