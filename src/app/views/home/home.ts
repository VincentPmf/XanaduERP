import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/UserService/user-service';
import { User } from '../../models/User/user';

/**
 * Composant principal de la page d'accueil.
 *
 * Rôle :
 * - Servir de conteneur pour les routes enfants via le RouterOutlet
 * - Fournir l'accès à l'utilisateur actuellement connecté
 * - Exposer une action de déconnexion
 */
@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  /**
   * Fonction retournant l'utilisateur actuellement authentifié.
   *
   * Cette référence est fournie par le UserService et permet :
   * - une lecture réactive de l'utilisateur courant
   * - l'accès aux informations utilisateur dans le template
   *
   * Retourne `null` si aucun utilisateur n'est connecté.
   */
  readonly currentUser: () => User | null;


  /**
   * Initialise le composant Home.
   *
   * Récupère la fonction `currentUser` exposée par le UserService
   * afin de pouvoir accéder à l'état d'authentification courant.
   *
   * @param userService Service gérant l'état utilisateur et l'authentification.
   */
  constructor(private userService: UserService) {
    this.currentUser = this.userService.currentUser;
    console.log('Current User:', this.currentUser()?.fullName);
  }

    /**
   * Déconnecte l'utilisateur courant.
   *
   * Délègue la logique de déconnexion au UserService
   * (suppression du token, nettoyage de l'état utilisateur, redirection éventuelle).
   */
  logout() {
    this.userService.logout();
  }
}
