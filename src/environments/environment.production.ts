/**
 * Configuration d’environnement – Production.
 *
 * Cet environnement est utilisé lors du build de production.
 * Il permet de :
 * - Activer les optimisations Angular
 * - Pointer vers l’API déployée en environnement réel
 */
export const environment = {
  production: true,
    /**
   * URL de base de l’API backend en production.
   *
   * L’API est exposée via le même domaine que le front
   * et accessible derrière le chemin `/api`
   */
  apiUrl: '/api',
};