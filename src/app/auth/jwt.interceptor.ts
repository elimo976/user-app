import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService implements HttpInterceptor {

  constructor(private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('accessToken');

      let authReq = req;
      if (token) {

        // Verifico se il token è scaduto
        if (this.isTokenExpired(token)) {
          localStorage.removeItem('accessToken');
          this.router.navigate(['/login']);
          return throwError(() => new Error('Token scaduto'));
        }
        // Clona la richiesta e aggiunge l'intestazione Authorization con il token
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authReq).pipe(
          catchError(error => {
            if (error.status === 401) {
              console.error('Non autorizzato');
              // Rimuove il token dal localStorage se è scaduto
              localStorage.removeItem('accessToken');
              this.router.navigate(['/login']);
            }
            return throwError(() => new Error('Errore nell\'autenticazione'));
          })
        )
      }
      // Se non c'è token, reindirizza alla pagina di login
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token mancante'));
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
      const payload = token.split('.')[1]; // Ottengo la parte payload del token (base64)
      if (!payload) return null;
      return JSON.parse(atob(payload)); // Decodifico e converto da base64 a JSON
    } catch (error) {
      console.error('Errore nella decodifica del token', error);
      return null;
    }
  }
}
