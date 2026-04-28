import { Injectable } from '@angular/core';
import { ChallengeTest, TestResult } from '../challenges/challenge.model';

// Minimal TypeScript __decorate helper (same as tsc emits)
const TS_HELPERS = `
var __decorate = function(decorators, target) {
  for (var i = decorators.length - 1; i >= 0; i--) {
    var d = decorators[i];
    if (typeof d === 'function') target = d(target) || target;
  }
  return target;
};
var __metadata = function() { return function() {}; };
`;

// Mock Angular modules so decorator calls don't throw
const ANGULAR_REQUIRE = `
var require = function(mod) {
  var noop = function() { return function(t) { return t; }; };
  var inputNoop = function() { return function() {}; };
  return {
    Pipe: noop, Component: noop, Directive: noop, Injectable: noop,
    NgModule: noop, Input: inputNoop, Output: inputNoop,
    HostListener: inputNoop, HostBinding: inputNoop,
    ElementRef: function() {}, EventEmitter: function() {},
  };
};
`;

@Injectable({ providedIn: 'root' })
export class TestRunnerService {
  async run(userCode: string, tests: ChallengeTest[], modelUri = ''): Promise<TestResult[]> {
    const jsCode = await this.transpile(modelUri);
    return tests.map((test) => {
      try {
        const result = test.fn(userCode, jsCode);
        if (result === true) return { name: test.name, passed: true };
        return { name: test.name, passed: false, error: result };
      } catch (e) {
        return { name: test.name, passed: false, error: String(e) };
      }
    });
  }

  /** Transpile via Monaco's TS worker using the editor's own model — no extra model created. */
  private async transpile(modelUri: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const monaco = (window as any).monaco;
    if (!monaco || !modelUri) return '';

    const uri = monaco.Uri.parse(modelUri);
    const model = monaco.editor.getModel(uri);
    if (!model) return '';

    const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
    const client = await getWorker(uri);
    const output = await client.getEmitOutput(modelUri);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsFile = output.outputFiles?.find((f: any) => f.name.endsWith('.js'));
    return jsFile?.text ?? '';
  }

  /**
   * Execute transpiled CommonJS code and return the named export.
   * Provides __decorate and Angular mocks so decorated classes run cleanly.
   */
  static execExport<T>(className: string, jsCode: string): T | null {
    try {
      const exports: Record<string, unknown> = {};
      const preamble = TS_HELPERS + ANGULAR_REQUIRE;
      // eslint-disable-next-line no-new-func
      const fn = new Function('exports', preamble + jsCode);
      fn(exports);
      return (exports[className] as T) ?? null;
    } catch {
      return null;
    }
  }
}
