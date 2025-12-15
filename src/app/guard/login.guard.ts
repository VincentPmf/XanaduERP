import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/UserService/user-service';
import { isPlatformBrowser } from '@angular/common';

/**
 * Guard d’authentification.
 *
 * Rôle :
 * - Protéger les routes nécessitant une authentification.
 * - Vérifier l’état de connexion de l’utilisateur avant l’activation d’une route.
 * - Rediriger vers la page de login si l’utilisateur n’est pas authentifié.
 *
 * Ce guard repose sur l’état réactif exposé par le UserService (`isLoggedIn`).
 */
export const authGuard: CanActivateFn = () => {
    /**
   * Injection du service utilisateur.
   *
   * Permet d’accéder à l’état d’authentification global de l’application.
   */
  const userService = inject(UserService);
    /**
   * Injection du routeur Angular.
   *
   * Utilisé pour rediriger l’utilisateur vers `/login`
   * lorsqu’il tente d’accéder à une route protégée sans être connecté.
   */
  const router = inject(Router);

    /**
   * Vérification de l’état de connexion.
   *
   * - Si l’utilisateur n’est pas connecté :
   *   - Redirection vers la page de login
   *   - Blocage de l’activation de la route
   * - Sinon :
   *   - Autorisation de l’accès à la route demandée
   */
  if (!userService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }


  return true;
};