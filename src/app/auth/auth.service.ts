import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private apiUrl = `${environment.base_URL}/auth`;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<{ accessToken: string }> {
    // console.log('Invio della richiesta di login'); // DEBUG
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login/`, { email, password }, { withCredentials: true })
      .pipe(
        tap(response => {
          // console.log('Risposta del backend:', response); // DEBUG
          if (response && response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
            // console.log('Token salvato nel localStorage:', localStorage.getItem('accessToken')); // DEBUG
          } else {
            console.error('Token non presente nella risposta del backend');
          }
        }),
        catchError(error => {
          console.error('Errore durante la richiesta HTTP:', error);  // Log dell'errore HTTP
          throw error;  // Rilancia l'errore per farlo gestire nel blocco `error` dell'`onSubmit`
        })
      );
  }


  logout(): void {
    localStorage.removeItem('accessToken');
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('accessToken') !== null;
  }
}
