import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/challenge-list/challenge-list').then(m => m.ChallengeList) },
  { path: 'challenge/:id', loadComponent: () => import('./components/challenge-shell/challenge-shell').then(m => m.ChallengeShell) },
  { path: '**', redirectTo: '' },
];
