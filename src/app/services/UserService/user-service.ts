import { computed, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { ApiUser, User } from '../../models/User/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


/**
 * Service de gestion des utilisateurs.
 *
 * Rôle :
 * - Centraliser les appels HTTP vers l'API utilisateur (CRUD, login).
 * - Maintenir en mémoire l'utilisateur actuellement connecté.
 * - Exposer un état réactif (`currentUser`, `isLoggedIn`) pour le reste de l'application.
 */
@Injectable({
  providedIn: 'root',
})

export class UserService {
  /** URL de base de l'API utilisateur, configurée via l'environnement. */
  private readonly base = environment.apiUrl;

    /**
   * Signal interne représentant l'utilisateur actuellement connecté.
   *
   * - `null` → aucun utilisateur connecté.
   * - `User` → utilisateur authentifié.
   */
  private readonly _currentUser = signal<User | null>(null);

  /**
   * Signal en lecture seule exposant l'utilisateur courant.
   *
   * Permet à d'autres composants/services d'observer l'état utilisateur
   * sans pouvoir le modifier directement.
   */
  readonly currentUser = this._currentUser.asReadonly();
    /**
   * Signal dérivé indiquant si un utilisateur est connecté.
   *
   * `true` si `_currentUser` n'est pas `null`, `false` sinon.
   */
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

    /**
   * Initialise le service avec le client HTTP Angular.
   *
   * @param http Client HTTP utilisé pour communiquer avec l'API backend.
   */
  constructor(private http: HttpClient) {}


  /**
   * Récupère la liste complète des utilisateurs.
   *
   * Effectue un `GET` sur l'URL de base de l'API.
   *
   * @returns Un `Observable` émettant un tableau de `User`.
   */
  list(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

    /**
   * Récupère un utilisateur par son identifiant.
   *
   * Effectue un `GET` sur `/{id}`.
   *
   * @param id Identifiant unique de l'utilisateur.
   * @returns Un `Observable` émettant l'utilisateur correspondant.
   */
  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}`);
  }

    /**
   * Crée un nouvel utilisateur.
   *
   * Effectue un `POST` sur l'URL de base avec les données fournies.
   *
   * @param data Données nécessaires à la création (email, mot de passe, prénom, nom).
   * @returns Un `Observable` émettant l'utilisateur créé.
   */
  create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<User> {
    return this.http.post<User>(this.base, data);
  }

    /**
   * Met à jour partiellement un utilisateur existant.
   *
   * Effectue un `PATCH` sur `/{id}` avec les champs à modifier.
   *
   * @param id Identifiant de l'utilisateur à mettre à jour.
   * @param data Champs partiels à mettre à jour (email, mot de passe, prénom, nom).
   * @returns Un `Observable` émettant l'utilisateur mis à jour.
   */
  update(id: number, data: Partial<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }>): Observable<User> {
    return this.http.patch<User>(`${this.base}/${id}`, data);
  }


  /**
   * Authentifie un utilisateur à partir de son email et mot de passe.
   *
   * Étapes :
   * 1. Envoie une requête `POST` sur `/login` avec les informations de connexion.
   * 2. Transforme la réponse `ApiUser` en modèle `User` via `User.fromApi`.
   * 3. Met à jour le signal `_currentUser` avec l'utilisateur authentifié.
   *
   * @param data Objet contenant l'email et le mot de passe.
   * @returns Un `Observable` émettant l'utilisateur authentifié.
   */
  login(data: { email: string; password: string }): Observable<User> {
    return this.http.post<ApiUser>(`${this.base}/login`, data).pipe(
      map(apiUser => User.fromApi(apiUser.user)),
      tap(user => this._currentUser.set(user))
    );
  }

  /**
   * Déconnecte l'utilisateur courant.
   *
   * Réinitialise l'état local en mettant `_currentUser` à `null`.
   * La logique complémentaire (nettoyage de token, redirection, etc.)
   * peut être gérée ailleurs ou ajoutée ici si nécessaire.
   */
  logout(): void {
    this._currentUser.set(null);
  }

}
