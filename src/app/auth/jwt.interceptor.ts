import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log('Intercepting request:', req.url); // DEBUG
    const token = localStorage.getItem('accessToken');
    // console.log('Token recuperato:', token); // DEBUG

    // Escludo le richieste di traduzione e login
    if (req.url.includes('/assets/i18n') || req.url.includes('/login')) {
      // console.log('Richiesta esclusa dall\'interceptor:', req.url); // DEBUG
      return next.handle(req);
    }

    if (token) {
      if (this.isTokenExpired(token)) {
        // console.log('Token scaduto'); // DEBUG
        localStorage.removeItem('accessToken');
        this.router.navigate(['/login']);
        return throwError(() => new Error('Token scaduto'));
      }

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log('Richiesta clonata con token:', authReq); // DEBUG
      return next.handle(authReq).pipe(
        catchError(error => {
          // console.error('Errore durante la richiesta:', error); // DEBUG
          if (error.status === 401) {
            // console.error('Non autorizzato'); // DEBUG
            localStorage.removeItem('accessToken');
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    } else {
      // console.log('Token mancante, reindirizzamento al login'); // DEBUG

      // Verifico se non mi trovo già nella pagina di login evitando un loop
      if (!this.router.url.includes('/login')) {
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
}
