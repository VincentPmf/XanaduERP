import { Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { merge } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';

import { UserService } from '../../services/UserService/user-service';

/**
 * Composant de page de connexion.
 *
 * Rôle :
 * - Gérer le formulaire de login (email + mot de passe)
 * - Valider les champs en temps réel
 * - Appeler le UserService pour authentifier l'utilisateur
 * - Rediriger vers la page d'accueil en cas de succès
 */

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  /** Champ email contrôlé par Reactive Forms, obligatoire et au format email. */
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  /** Message d'erreur associé au champ email, mis à jour en fonction des validateurs. */
  emailErrorMessage = signal('');
  /** Champ mot de passe contrôlé par Reactive Forms, obligatoire. */
  readonly password = new FormControl('', [Validators.required]);
  /** Message d'erreur associé au champ mot de passe, mis à jour en fonction des validateurs. */
  passwordErrorMessage = signal('');
  /** Message d'erreur global en cas d'échec de la connexion. */
  readonly errorLogin = signal('');

  private router = inject(Router);

  /**
   * Initialise le composant.
   *
   * À l'initialisation, on s'abonne aux changements de statut et de valeur
   * du champ email pour mettre à jour dynamiquement le message d'erreur.
   *
   * @param userService Service métier utilisé pour authentifier l'utilisateur.
  */
  constructor(
    private userService: UserService
  ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage())
  }
  /**
   * Met à jour `emailErrorMessage` en fonction des erreurs du champ email.
   *
   * - `required` → l'utilisateur doit saisir une valeur.
   * - `email` → le format saisi n'est pas une adresse email valide.
   * - aucun erreur → message vide.
   */
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.emailErrorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.emailErrorMessage.set('Not a valid email');
    } else {
      this.emailErrorMessage.set('');
    }
  }

    /**
   * Tente de connecter l'utilisateur.
   *
   * Étapes :
   * 1. Vérifie la validité des champs email et mot de passe.
   * 2. En cas d'erreur de validation, met à jour les messages dédiés.
   * 3. Si le formulaire est valide, appelle `userService.login`.
   * 4. En cas de succès, redirige l'utilisateur vers `/home`.
   * 5. En cas d'échec, affiche un message d'erreur global dans `errorLogin`.
   */
  login() {
    if (this.email.invalid) {
      this.emailErrorMessage.set('Please enter a valid email before logging in.');
      return;
    } else if (this.password.invalid) {
      this.passwordErrorMessage.set('Please enter your password before logging in.');
      return;
    }
    this.userService.login({ email: this.email.value || '', password: this.password.value || '' })
      .subscribe({
        next: user => {
          console.log('Logged in user:', user);
          this.router.navigate(['/home']);
        },
        error: err => {
          this.errorLogin.set('Login failed. Please check your credentials and try again.');
        }
      });
  }

}
