import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { MessageService } from '../../shared/services/message.service';
import { TranslocoService } from '@ngneat/transloco';
import { User } from '../user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
 userId: string | null = null;
 private routeSub: Subscription | undefined;

 roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
 ];

 constructor(
  private userService: UsersService,
  private messageService: MessageService,
  private translocoService: TranslocoService,
  private router: Router,
  private route: ActivatedRoute
 ) {}

 ngOnInit(): void {
  this.initForm();
  this.loadUser();
}

ngOnDestroy(): void {
  if (this.routeSub) {
    this.routeSub.unsubscribe();
  }
}

private initForm(): void {
  this.userForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
      Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl(null),
    phoneNumber: new FormControl('', Validators.pattern(/^\+?[0-9]{7,15}$/)),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    ]),
    address: new FormGroup({
      street: new FormControl(''),
      city: new FormControl('', Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)),
      zipCode: new FormControl('', [
        Validators.pattern(/^[0-9]{5}$/),
        Validators.maxLength(5),
      ]),
      country: new FormControl('', Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)),
    }),
  });
}

onPasswordInput(event: Event): void {
  const inputElement = event.target as HTMLInputElement; // Ottieni l'elemento input
  const passwordValue = inputElement.value; // Ottieni il valore inserito
  this.userForm.get('password')?.setValue(passwordValue); // Aggiorna il FormControl
}

private loadUser(): void {
  this.routeSub = this.route.params.subscribe((params) => {
    this.userId = params['id'];
    // console.log('User ID:', this.userId); // DEBUG
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe((user) => {
        this.user = user;
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          dateOfBirth: user.dateOfBirth,
          phoneNumber: user.phoneNumber,
          address: user.address,
        });
      });
    }
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
  console.log('Form submitted')
  if (this.userForm.invalid) {
    this.messageService.setMessage(this.translocoService.translate('message.formInvalid'));
    console.log('Form is invalid')
    return;
    }
    // Se l'utente ha un id si sta aggiornando un utente esistente
    if (this.userId) {
      console.log('Updating user with ID:', this.userId);
      this.updateUser();
    } else {
      console.log('Creating new user');
      // Se non ha un id, significa che si sta creando un nuovo utente
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

 updateUser(): void {
    console.log('Current user:', this.user); // Verifica se l'utente è presente

    if (this.user?._id) {
      console.log('Attempting to update user with ID:', this.user._id);
      this.userService.updateUser(this.user!._id, this.userForm.value).subscribe({
        next: (updatedUser) => {
          console.log('User updated successfully:', updatedUser);

          // Gestione della risposta in caso di successo
          this.messageService.setMessage(this.translocoService.translate('messages.updatedSuccessfully'));
          this.successMessage = this.translocoService.translate('messages.updatedSuccessfully');

          this.showMessage = true;
          this.user = updatedUser;
          this.userForm.reset();

          // Imposto un timeout per reindirizzare l'utente dopo 2 secondi
          setTimeout(() => {
            this.router.navigate(['/usersList']);
          }, 3000);
        },
        error: (error) => {
          // Gestione dell'errore in caso di fallimento
          this.messageService.setMessage(this.translocoService.translate('messages.error.updateError'));
          console.error('Error updating user:', error);
        }
      });
    }
  }

}
