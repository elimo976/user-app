import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.base_URL}/users`;

  constructor(private http: HttpClient) { }

  // Ottenere tutti gli utenti
  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }

  // Ottenere un singolo utente

  // Creare un nuovo utente

  // Aggiornare un utente

  // Eliminare un utente
}
