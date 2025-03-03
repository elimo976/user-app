import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');

    // Escludo le richieste di traduzione e login
    if (req.url.includes('/assets/i18n') || req.url.includes('/login')) {
      return next.handle(req);
    }

    if (token) {
      if (this.isTokenExpired(token)) {
        localStorage.removeItem('accessToken');
        if (!this.isTestEnvironment()) {
          this.router.navigate(['/login']);
        }
        return throwError(() => new Error('Token scaduto'));
      }

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(authReq).pipe(
        catchError(error => {
          if (error.status === 401) {
            localStorage.removeItem('accessToken');
            if (!this.isTestEnvironment()) {
              this.router.navigate(['/login']);
            }
          }
          return throwError(() => error);
        })
      );
    } else {
      if (!this.isTestEnvironment() && !this.router.url.includes('/login')) {
        this.router.navigate(['/login']);
      }
      return throwError(() => new Error('Token mancante'));
    }
  }


  // Funzione per decodificare il token e verificare se è scaduto
  private isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (!decodedToken) return true;

    const currentTime = Math.floor(Date.now() / 1000); // Ottiene il tempo corrente in secondi
    return decodedToken.exp < currentTime;
  }
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decodedPayload = decodeURIComponent(atob(payload).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Errore nella decodifica del token', error);
      return null;
    }
  }

  private isTestEnvironment(): boolean {
    return typeof TestBed !== 'undefined';
  }
}
