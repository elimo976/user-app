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
    // Imposta il messaggio
    this.messageSubject.next(message);
  }
}

