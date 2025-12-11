import { Routes } from '@angular/router';
import {
    Home,
    About,
    Contact,
    Login
} from './views';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' }
];
