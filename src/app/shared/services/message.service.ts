import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new BehaviorSubject<string | null>(null);
  message$ = this.messageSubject.asObservable();

  constructor() { }

  setMessage(message: string): void {
    // console.log('[MessageService] Impostando messaggio:', message); // DEBUG
    // Imposta il messaggio
    this.messageSubject.next(message);
    setTimeout(() => {
      console.log('Sto cancellando il messaggio...');
      this.clearMessage();
    }, 3000);
  }

  clearMessage(): void {
    this.messageSubject.next(null); // Reset del messaggio
  }
}

