import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ChallengeService } from '../../services/challenge';
import { StorageService } from '../../services/storage';
import { Challenge } from '../../challenges/challenge.model';

@Component({
  selector: 'app-challenge-list',
  imports: [],
  templateUrl: './challenge-list.html',
  styleUrl: './challenge-list.scss',
})
export class ChallengeList {
  private readonly router = inject(Router);
  private readonly challengeService = inject(ChallengeService);
  private readonly storage = inject(StorageService);

  protected readonly challenges = this.challengeService.getAll();

  protected readonly stats = computed(() => {
    const solved = this.challenges.filter(c => this.isSolved(c)).length;
    return { solved, total: this.challenges.length };
  });

  protected isSolved(challenge: Challenge): boolean {
    return this.storage.loadProgress(challenge.id)?.solved ?? false;
  }

  protected open(challenge: Challenge): void {
    this.router.navigate(['/challenge', challenge.id]);
  }
}
