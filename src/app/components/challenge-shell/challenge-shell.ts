import { Component, inject, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ChallengeService } from '../../services/challenge';
import { TestRunnerService } from '../../services/test-runner';
import { StorageService } from '../../services/storage';
import { CodeEditor } from '../code-editor/code-editor';
import { TestRunnerPanel } from '../test-runner/test-runner';
import { ResizeHandle } from '../resize-handle';
import { TestResult, Challenge } from '../../challenges/challenge.model';
import { marked } from 'marked';

type LeftTab = 'description' | 'tests' | 'solutions';

@Component({
  selector: 'app-challenge-shell',
  imports: [CodeEditor, TestRunnerPanel, ResizeHandle, RouterLink],
  templateUrl: './challenge-shell.html',
  styleUrl: './challenge-shell.scss',
})
export class ChallengeShell {
  private readonly router = inject(Router);
  private readonly routeId = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map(p => Number(p.get('id'))))
  );
  private readonly challengeService = inject(ChallengeService);
  private readonly testRunnerService = inject(TestRunnerService);
  private readonly storage = inject(StorageService);

  protected readonly challenge = this.challengeService.current;
  protected readonly allChallenges = this.challengeService.getAll();

  protected leftTab = signal<LeftTab>('description');
  protected userCode = signal('');
  protected testResults = signal<TestResult[]>([]);
  protected hasRun = signal(false);
  protected solved = signal(false);
  protected drawerOpen = signal(false);
  private editorModelUri = '';

  protected descriptionHtml = computed(() => {
    const desc = this.challenge()?.description ?? '';
    return marked(desc) as string;
  });

  protected solutionHtml = computed(() => {
    const sol = this.challenge()?.solution ?? '';
    return marked('```typescript\n' + sol + '\n```') as string;
  });

  constructor() {
    effect(() => {
      const id = this.routeId();
      if (id) this.challengeService.goTo(id - 1);
    });

    effect(() => {
      const ch = this.challenge();
      if (!ch) return;
      const saved = this.storage.loadProgress(ch.id);
      this.userCode.set(saved?.code ?? ch.starterCode);
      this.solved.set(saved?.solved ?? false);
      this.testResults.set([]);
      this.hasRun.set(false);
      this.leftTab.set('description');
      this.drawerOpen.set(false);
    });
  }

  protected isSolved(ch: Challenge): boolean {
    return this.storage.loadProgress(ch.id)?.solved ?? false;
  }

  protected openChallenge(ch: Challenge): void {
    this.drawerOpen.set(false);
    this.router.navigate(['/challenge', ch.id]);
  }

  protected toggleDrawer(): void {
    this.drawerOpen.update(v => !v);
  }

  protected closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  protected onModelUriReady(uri: string): void {
    this.editorModelUri = uri;
  }

  protected setLeftTab(tab: LeftTab): void {
    this.leftTab.set(tab);
  }

  protected onCodeChange(code: string): void {
    this.userCode.set(code);
    this.hasRun.set(false);
    this.storage.saveProgress(this.challenge().id, { code });
  }

  protected resetCode(): void {
    const starter = this.challenge().starterCode;
    this.userCode.set(starter);
    this.hasRun.set(false);
    this.storage.saveProgress(this.challenge().id, { code: starter });
  }

  protected loadHint(): void {
    const solution = this.challenge().solution;
    this.userCode.set(solution);
    this.hasRun.set(false);
    this.storage.saveProgress(this.challenge().id, { code: solution });
  }

  protected async runTests(): Promise<void> {
    const ch = this.challenge();
    if (!ch) return;
    const results = await this.testRunnerService.run(this.userCode(), ch.tests, this.editorModelUri);
    this.testResults.set(results);
    this.hasRun.set(true);
    if (results.every((r) => r.passed)) {
      this.solved.set(true);
      this.storage.saveProgress(ch.id, { solved: true });
    }
  }

  protected allPassing = computed(
    () => this.hasRun() && this.testResults().every((r) => r.passed)
  );
}
