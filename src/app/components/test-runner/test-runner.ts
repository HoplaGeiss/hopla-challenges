import { Component, input, computed } from '@angular/core';
import { TestResult } from '../../challenges/challenge.model';

@Component({
  selector: 'app-test-runner',
  imports: [],
  templateUrl: './test-runner.html',
  styleUrl: './test-runner.scss',
})
export class TestRunnerPanel {
  readonly results = input<TestResult[]>([]);
  readonly hasRun = input(false);

  protected passCount = computed(() => this.results().filter((r) => r.passed).length);
  protected total = computed(() => this.results().length);
  protected progressPct = computed(() =>
    this.total() === 0 ? 0 : Math.round((this.passCount() / this.total()) * 100)
  );
}
