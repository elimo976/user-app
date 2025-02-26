import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
  encapsulation: ViewEncapsulation.None
})
export class UserDetailComponent {
 @Input() user: User | null = null; // Utente da visualizzare nella modale
 @Input() display: boolean = false; // Controlla la visibilità della modale
 @Output() close = new EventEmitter(); // Evento per chiudere la modale

 closeModal(): void {
  this.close.emit(); // Comunica al genitore di chiudere la modale
 }
}
