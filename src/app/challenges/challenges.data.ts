import { Challenge } from './challenge.model';
import { TestRunnerService } from '../services/test-runner';

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Temperature Pipe',
    category: 'Pipes',
    difficulty: 'medium',
    description: `## Temperature Pipe

Create a pipe called \`temperature\` that converts a Celsius value to Fahrenheit (\`'F'\`) or Kelvin (\`'K'\`).

### Usage

\`\`\`html
{{ 100 | temperature:'F' }}  →  "212°F"
{{ 0   | temperature:'K' }}  →  "273.15K"
{{ 0   | temperature:'F' }}  →  "32°F"
\`\`\`

### Formulas

- **Celsius → Fahrenheit:** \`(C × 9/5) + 32\`
- **Celsius → Kelvin:** \`C + 273.15\`

### Requirements

- Decorate the class with \`@Pipe({ name: 'temperature' })\`
- Implement \`PipeTransform\` and its \`transform(value, unit)\` method
- Return the result as a string with the unit appended (no space before unit symbol)
`,
    starterCode: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'temperature', standalone: true })
export class TemperaturePipe implements PipeTransform {
  transform(value: number, unit: 'F' | 'K'): string {
    // Your implementation here
    return '';
  }
}
`,
    solution: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'temperature', standalone: true })
export class TemperaturePipe implements PipeTransform {
  transform(value: number, unit: 'F' | 'K'): string {
    if (unit === 'F') {
      return \`\${(value * 9) / 5 + 32}°F\`;
    }
    return \`\${value + 273.15}K\`;
  }
}
`,
    tests: [
      {
        name: 'Pipe has @Pipe decorator with name "temperature"',
        fn: (code) => {
          if (!/@Pipe\s*\(\s*\{[^}]*name\s*:\s*['"]temperature['"]/.test(code)) {
            return 'Expected @Pipe({ name: \'temperature\' }) decorator';
          }
          return true;
        },
      },
      {
        name: 'Implements PipeTransform',
        fn: (code) => {
          if (!/implements\s+PipeTransform/.test(code)) {
            return 'Class must implement PipeTransform';
          }
          return true;
        },
      },
      {
        name: '0°C → Kelvin = "273.15K"',
        fn: (_, jsCode) => {
          const pipe = TestRunnerService.execExport<{ transform: (v: number, u: string) => string }>(
            'TemperaturePipe', jsCode
          );
          if (!pipe) return 'Could not instantiate TemperaturePipe — check for syntax errors';
          const instance = new (pipe as unknown as new () => { transform: (v: number, u: string) => string })();
          const result = instance.transform(0, 'K');
          if (result !== '273.15K') return `Expected "273.15K" but got "${result}"`;
          return true;
        },
      },
      {
        name: '100°C → Fahrenheit = "212°F"',
        fn: (_, jsCode) => {
          const pipe = TestRunnerService.execExport<{ transform: (v: number, u: string) => string }>(
            'TemperaturePipe', jsCode
          );
          if (!pipe) return 'Could not instantiate TemperaturePipe — check for syntax errors';
          const instance = new (pipe as unknown as new () => { transform: (v: number, u: string) => string })();
          const result = instance.transform(100, 'F');
          if (result !== '212°F') return `Expected "212°F" but got "${result}"`;
          return true;
        },
      },
      {
        name: '0°C → Fahrenheit = "32°F"',
        fn: (_, jsCode) => {
          const pipe = TestRunnerService.execExport<{ transform: (v: number, u: string) => string }>(
            'TemperaturePipe', jsCode
          );
          if (!pipe) return 'Could not instantiate TemperaturePipe — check for syntax errors';
          const instance = new (pipe as unknown as new () => { transform: (v: number, u: string) => string })();
          const result = instance.transform(0, 'F');
          if (result !== '32°F') return `Expected "32°F" but got "${result}"`;
          return true;
        },
      },
    ],
  },
  {
    id: 2,
    title: 'Counter Component',
    category: 'Signals',
    difficulty: 'easy',
    description: `## Counter Component

Create a standalone Angular component called \`CounterComponent\` using Angular Signals.

### Requirements

- A \`signal\` called \`count\` initialized to \`0\`
- A \`computed\` called \`doubleCount\` that returns \`count() * 2\`
- A \`<button>\` that increments \`count\` by 1 on click
- The template must display both \`count\` and \`doubleCount\`

### Example Template

\`\`\`html
<p>Count: {{ count() }}</p>
<p>Double: {{ doubleCount() }}</p>
<button (click)="increment()">Increment</button>
\`\`\`
`,
    starterCode: `import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <!-- Your template here -->
  \`,
})
export class CounterComponent {
  // Your implementation here
}
`,
    solution: `import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">Increment</button>
  \`,
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment(): void {
    this.count.update(c => c + 1);
  }
}
`,
    tests: [
      {
        name: 'Component has @Component decorator',
        fn: (code) => {
          if (!/@Component\s*\(/.test(code)) return 'Expected @Component decorator';
          return true;
        },
      },
      {
        name: 'Declares a signal called count',
        fn: (code) => {
          if (!/count\s*=\s*signal\s*\(\s*0\s*\)/.test(code)) {
            return 'Expected: count = signal(0)';
          }
          return true;
        },
      },
      {
        name: 'Declares a computed called doubleCount',
        fn: (code) => {
          if (!/doubleCount\s*=\s*computed\s*\(/.test(code)) {
            return 'Expected: doubleCount = computed(...)';
          }
          return true;
        },
      },
      {
        name: 'doubleCount returns count * 2',
        fn: (code) => {
          if (!/count\(\)\s*\*\s*2/.test(code)) {
            return 'Expected doubleCount to be computed(() => count() * 2)';
          }
          return true;
        },
      },
      {
        name: 'Template has a button with click handler',
        fn: (code) => {
          if (!/\(click\)/.test(code)) return 'Expected a (click) event binding on a button';
          return true;
        },
      },
    ],
  },
  {
    id: 3,
    title: 'Highlight Directive',
    category: 'Directives',
    difficulty: 'medium',
    description: `## Highlight Directive

Create an **attribute directive** called \`HighlightDirective\` with selector \`[appHighlight]\`.

### Behavior

- Accepts a \`color\` input (default: \`'yellow'\`)
- On **mouseenter**: sets the host element's \`backgroundColor\` to the input color
- On **mouseleave**: resets the \`backgroundColor\` to empty string

### Usage

\`\`\`html
<p appHighlight>Hover me (yellow by default)</p>
<p appHighlight color="lightblue">Hover me (light blue)</p>
\`\`\`

### Requirements

- Use \`@Directive({ selector: '[appHighlight]' })\`
- Use \`@HostListener\` for mouse events
- Use \`@Input()\` for the color property
`,
    starterCode: `import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @Input() color = 'yellow';

  constructor(private el: ElementRef) {}

  // Your implementation here
}
`,
    solution: `import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @Input() color = 'yellow';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.el.nativeElement.style.backgroundColor = this.color;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
`,
    tests: [
      {
        name: 'Directive has selector [appHighlight]',
        fn: (code) => {
          if (!/selector\s*:\s*['"`]\[appHighlight\]['"`]/.test(code)) {
            return 'Expected selector: \'[appHighlight]\'';
          }
          return true;
        },
      },
      {
        name: 'Has @Input() color property',
        fn: (code) => {
          if (!/@Input\(\)\s+color/.test(code) && !/color\s*=\s*input\(/.test(code)) {
            return 'Expected @Input() color or color = input(...)';
          }
          return true;
        },
      },
      {
        name: 'Has @HostListener for mouseenter',
        fn: (code) => {
          if (!/@HostListener\s*\(\s*['"]mouseenter['"]/.test(code)) {
            return 'Expected @HostListener(\'mouseenter\')';
          }
          return true;
        },
      },
      {
        name: 'Has @HostListener for mouseleave',
        fn: (code) => {
          if (!/@HostListener\s*\(\s*['"]mouseleave['"]/.test(code)) {
            return 'Expected @HostListener(\'mouseleave\')';
          }
          return true;
        },
      },
      {
        name: 'Sets backgroundColor on mouseenter',
        fn: (code) => {
          if (!/backgroundColor/.test(code)) {
            return 'Expected el.nativeElement.style.backgroundColor to be set';
          }
          return true;
        },
      },
    ],
  },
];
