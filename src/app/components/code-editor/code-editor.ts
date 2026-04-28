import { Component, input, output, signal, effect } from '@angular/core';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Component({
  selector: 'app-code-editor',
  imports: [MonacoEditorModule],
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.scss',
})
export class CodeEditor {
  readonly initialCode = input<string>('');
  readonly codeChange = output<string>();
  readonly modelUriReady = output<string>();

  protected filename = signal('solution.ts');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private editor: any = null;

  protected editorOptions = {
    theme: 'vs-dark',
    language: 'typescript',
    fontSize: 14,
    fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    lineNumbers: 'on',
    roundedSelection: false,
    padding: { top: 12 },
  };

  constructor() {
    effect(() => {
      const initial = this.initialCode();
      if (this.editor && this.editor.getValue() !== initial) {
        this.editor.setValue(initial);
        // Move cursor to the start so it doesn't sit at end of old content
        this.editor.setPosition({ lineNumber: 1, column: 1 });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected onEditorInit(editor: any): void {
    this.editor = editor;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const monaco = (window as any).monaco;

    // Replace the auto-created inmemory://model/1 with a file:// URI so the
    // TypeScript language service worker can resolve it without errors.
    const uri = monaco.Uri.parse('file:///solution.ts');
    let model = monaco.editor.getModel(uri);
    if (!model) {
      model = monaco.editor.createModel(this.initialCode(), 'typescript', uri);
    } else {
      model.setValue(this.initialCode());
    }
    editor.setModel(model);

    editor.onDidChangeModelContent(() => {
      this.codeChange.emit(editor.getValue());
    });

    this.modelUriReady.emit(uri.toString());
  }
}
