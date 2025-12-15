/**
 * Configuration d’environnement – Développement.
 *
 * Cet environnement est utilisé lors du développement local.
 * Il permet de :
 * - Pointer l’application Angular vers une API locale
 * - Désactiver les optimisations liées à la production
 */
export const environment = {
  production: false,
    /**
   * URL de base de l’API backend en développement.
   *
   * Ici, l’API est accessible localement sur le port 3000.
   * Typiquement utilisée avec un serveur Go en local.
   */
  apiUrl: 'http://localhost:3000',
};