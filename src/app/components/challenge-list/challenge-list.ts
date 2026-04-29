import { Component, inject, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChallengeService } from '../../services/challenge';
import { StorageService } from '../../services/storage';
import { PostHogService } from '../../services/posthog.service';
import { Challenge } from '../../challenges/challenge.model';

@Component({
  selector: 'app-challenge-list',
  imports: [],
  templateUrl: './challenge-list.html',
  styleUrl: './challenge-list.scss',
})
export class ChallengeList implements OnInit {
  private readonly router = inject(Router);
  private readonly challengeService = inject(ChallengeService);
  private readonly storage = inject(StorageService);
  private readonly posthogService = inject(PostHogService);

  protected readonly challenges = this.challengeService.getAll();

  protected readonly stats = computed(() => {
    const solved = this.challenges.filter((c) => this.isSolved(c)).length;
    return { solved, total: this.challenges.length };
  });

  ngOnInit(): void {
    this.posthogService.posthog.capture('challenge_list_viewed', {
      total_challenges: this.challenges.length,
      solved_challenges: this.stats().solved,
    });
  }

  protected isSolved(challenge: Challenge): boolean {
    return this.storage.loadProgress(challenge.id)?.solved ?? false;
  }

  protected open(challenge: Challenge): void {
    this.posthogService.posthog.capture('challenge_opened', {
      challenge_id: challenge.id,
      challenge_title: challenge.title,
      challenge_category: challenge.category,
      challenge_difficulty: challenge.difficulty,
      already_solved: this.isSolved(challenge),
    });
    this.router.navigate(['/challenge', challenge.id]);
  }
}
