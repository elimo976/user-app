import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { MessageService } from '../../shared/services/message.service';
import { TranslocoService } from '@ngneat/transloco';
import { User } from '../user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
  encapsulation: ViewEncapsulation.None
})
export class UserFormComponent {
 userForm!: FormGroup;
 user?: User;
 successMessage: string | null = null;
 showMessage: boolean = false;

 roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
 ];

 constructor(
  private userService: UsersService,
  private messageService: MessageService,
  private translocoService: TranslocoService,
  private router: Router
 ) {}

 ngOnInit(): void {
  this.userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl(null),
    phoneNumber: new FormControl('', Validators.pattern(/^\+?[0-9]{7,15}$/)),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)]),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl('', Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)),
      zipCode: new FormControl('', [Validators.pattern(/^[0-9]{5}$/), Validators.maxLength(5)],),
      country: new FormControl('', Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)),
    })
  });
 }

 getErrorMessage(controlName: string): string {
  const control = this.userForm.get(controlName);
  if (control?.hasError('required')) {
    return this.translocoService.translate('messages.error.required');
  } else if (control?.hasError('email')) {
    return this.translocoService.translate('messages.error.email');
  } else if (control?.hasError('minlength')) {
    const minLength = control.getError('minlength').requiredLength;
    return this.translocoService.translate('messages.error.minlength', { minLength });
  } else if (control?.hasError('maxlength')) {
    const maxLength = control.getError('maxlength').requiredLength;
    return this.translocoService.translate('messages.error.maxlength', { maxLength });
  } else if (control?.hasError('pattern')) {
    return this.translocoService.translate('messages.error.pattern');
  }
  return '';
}

 onSubmit(): void {
  if (this.userForm.invalid) {
    this.messageService.setMessage(this.translocoService.translate('message.formInvalid'));
    return;
    }
    // Se l'utente ha un id si sta aggiornando un utente esistente
    if (this.user?.id) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private createUser(): void {
    // Chiamata al servizio per aggiungere l'utente
    this.userService.addUser(this.userForm.value).subscribe({
      next: () => {
        // Gestione della risposta in caso di successo
        this.messageService.setMessage(this.translocoService.translate('messages.addedSuccessfully'));
        this.successMessage = this.translocoService.translate('messages.addedSuccessfully');

       this.showMessage = true;
        this.userForm.reset();

        // Imposta un timeout per reindirizzare l'utente dopo 2 secondi
        setTimeout(() => {
          this.router.navigate(['/usersList']);
        }, 3000);
      },
      error: (error) => {
        // Gestione dell'errore in caso di fallimento
        this.messageService.setMessage(this.translocoService.translate('message.error.addError'));
        console.error(error); // Log dell'errore per il debug
      }
    });
  }

  private updateUser(): void {
    if(this.user?.id) {
        // Chiamata al servizio per aggiornare l'utente
      this.userService.updateUser(this.user!.id, this.userForm.value).subscribe({
        next: (updatedUser) => {
          // Gestione della risposta in caso di successo
          this.messageService.setMessage(this.translocoService.translate('user.updatedSuccessfully'));
          this.user = updatedUser // Aggiorna il riferimento all'utente con i dati restituiti dal server
          this.userForm.reset();
        },
        error: (error) => {
          // Gestione dell'errore in caso di fallimento
          this.messageService.setMessage(this.translocoService.translate('user.updateError'));
          console.error(error); // Log dell'errore per il debug
        }
      });
    }
  }
}
