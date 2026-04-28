import { Injectable } from '@angular/core';

interface ChallengeProgress {
  code: string;
  solved: boolean;
}

const PREFIX = 'hopla:challenge:';

@Injectable({ providedIn: 'root' })
export class StorageService {
  loadProgress(challengeId: number): ChallengeProgress | null {
    try {
      const raw = localStorage.getItem(`${PREFIX}${challengeId}`);
      return raw ? (JSON.parse(raw) as ChallengeProgress) : null;
    } catch {
      return null;
    }
  }

  saveProgress(challengeId: number, progress: Partial<ChallengeProgress>): void {
    try {
      const existing = this.loadProgress(challengeId) ?? { code: '', solved: false };
      localStorage.setItem(
        `${PREFIX}${challengeId}`,
        JSON.stringify({ ...existing, ...progress })
      );
    } catch {
      // localStorage unavailable (private mode, storage full) — fail silently
    }
  }
}
