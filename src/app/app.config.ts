import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';
import { AppErrorHandler } from './core/error-handler';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    provideMonacoEditor({
      baseUrl: 'assets/monaco-editor/min/vs',
      onMonacoLoad: () => {
        const ts = (window as any).monaco.languages.typescript;
        ts.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: false,
        });
        ts.typescriptDefaults.setCompilerOptions({
          target: ts.ScriptTarget.ES2022,
          moduleResolution: ts.ModuleResolutionKind.NodeJs,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
        });
      },
    }),
  ],
};
