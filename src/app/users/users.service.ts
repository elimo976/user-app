import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { MessageService } from '../shared/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.base_URL}/users`;
  private apiUrlAuth = `${environment.base_URL}/auth/register`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  // Ottenere tutti gli utenti
  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error) => this.handleError(error, 'errors.getAllUsers'))
    );
  }

  // Ottenere un singolo utente
  getUserById(userId: string): Observable<User> {
    if (!userId) {
      console.error('ID utente non valido');
      return throwError(() => new Error('ID utente non valido'));
    }
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      catchError((error) => this.handleError(error, 'errors.getUserById'))
    );
  }

  // Creare un nuovo utente
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrlAuth, user).pipe(
      catchError((error) => this.handleError(error, 'errors.addUser'))
    );
  }

  // Aggiornare un utente
  updateUser(userId: string, updateData: Partial<User>): Observable<User> {
    if (!userId) {
      console.error('ID utente non valido');
      return throwError(() => new Error('ID utente non valido'));
    }
    console.log('Sending update request for user ID:', userId);
    console.log('Update data:', updateData);
    return this.http.patch<User>(`${this.apiUrl}/profile/${userId}`, updateData).pipe(
      tap(updatedUser => {
        console.log('Profilo aggiornato con successo', updatedUser);
      }),
      catchError((error) => this.handleError(error,'messages.error.updateError')) // Passa la chiave di traduzione
    );
  }

  // Eliminare un utente
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => this.handleError(error, 'errors.deleteUser'))
    );
  }

  private handleError(error: HttpErrorResponse, translationKey: string) {
    console.error('Errore HTTP:', error);
    this.messageService.setMessage(translationKey); // Passo la chiave
    return throwError(() => new Error('Errore durante la richiesta HTTP: ' + error.message))
  }
}
