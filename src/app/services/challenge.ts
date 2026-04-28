import { Injectable, signal, computed } from '@angular/core';
import { Challenge } from '../challenges/challenge.model';
import { CHALLENGES } from '../challenges/challenges.data';

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  private readonly challenges = CHALLENGES;
  private currentIndex = signal(0);

  readonly current = computed(() => this.challenges[this.currentIndex()]);
  readonly total = this.challenges.length;
  readonly progress = computed(() => this.currentIndex() + 1);

  goTo(index: number): void {
    if (index >= 0 && index < this.challenges.length) {
      this.currentIndex.set(index);
    }
  }

  next(): void {
    this.goTo(this.currentIndex() + 1);
  }

  prev(): void {
    this.goTo(this.currentIndex() - 1);
  }

  getAll(): Challenge[] {
    return this.challenges;
  }
}
