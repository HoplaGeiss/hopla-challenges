import { Challenge } from './challenge.model';
import { TestRunnerService } from '../services/test-runner';

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Temperature Pipe',
    category: 'Pipes',
    difficulty: 'medium',
    description: `Create a pipe called \`temperature\` that converts a Celsius value to Fahrenheit (\`'F'\`) or Kelvin (\`'K'\`).

### Usage

\`\`\`html
{{ 100 | temperature:'F' }}  →  "212°F"
{{ 0   | temperature:'K' }}  →  "273.15K"
{{ 0   | temperature:'F' }}  →  "32°F"
\`\`\`

### Formulas

- **Celsius → Fahrenheit:** \`(C × 9/5) + 32\`
- **Celsius → Kelvin:** \`C + 273.15\`
`,
    starterCode: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'temperature' })
export class TemperaturePipe implements PipeTransform {
  transform(value: number, unit: 'F' | 'K'): string {
    // Your implementation here
    return '';
  }
}
`,
    hint: `Check the unit with an \`if\` or ternary, apply the formula, then use a template literal to append the symbol — \`°F\` or \`K\` — directly after the number with no space.`,
    solution: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'temperature' })
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
    description: `Create a standalone Angular component called \`CounterComponent\` using Angular Signals.

The template is already wired up — implement the class logic to make it work.
`,
    starterCode: `import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">Increment</button>
  \`,
})
export class CounterComponent {
  // Your implementation here
}
`,
    hint: `Declare \`count\` as a \`signal(0)\` and \`doubleCount\` as a \`computed()\` that reads it. In the template, call them as functions — \`count()\`, \`doubleCount()\` — and use \`count.update()\` inside your click handler rather than reassigning directly.`,
    solution: `import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
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
        name: 'count is reactive',
        fn: (code) => {
          if (!/count\s*=\s*signal\s*\(\s*0\s*\)/.test(code)) {
            return 'Expected: count = signal(0)';
          }
          return true;
        },
      },
      {
        name: 'doubleCount derives from count',
        fn: (code) => {
          if (!/doubleCount\s*=\s*computed\s*\(/.test(code)) {
            return 'Expected: doubleCount = computed(...)';
          }
          return true;
        },
      },
      {
        name: 'doubleCount is always twice the count',
        fn: (code) => {
          if (!/count\(\)\s*\*\s*2/.test(code)) {
            return 'Expected doubleCount to be computed(() => count() * 2)';
          }
          return true;
        },
      },
      {
        name: 'clicking the button increments count',
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
    description: `Create an **attribute directive** called \`HighlightDirective\` with selector \`[appHighlight]\`.

### Behavior

- Accepts a \`color\` input (default: \`'yellow'\`)
- Hovering over the element sets its background to the input color
- Moving the cursor away restores the original background

### Usage

\`\`\`html
<p appHighlight>Hover me (yellow by default)</p>
<p appHighlight color="lightblue">Hover me (light blue)</p>
\`\`\`
`,
    starterCode: `import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    // wire up mouse events here
  },
})
export class HighlightDirective {
  color = input('yellow');
  private el = inject(ElementRef);

  // Your implementation here
}
`,
    hint: `In the \`host\` object, bind \`'(mouseenter)'\` and \`'(mouseleave)'\` to method names as strings. Those methods can then reach the DOM element via \`this.el.nativeElement\` — remember that \`color\` is a signal, so read it with \`this.color()\`.`,
    solution: `import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirective {
  color = input('yellow');
  private el = inject(ElementRef);

  onMouseEnter(): void {
    this.el.nativeElement.style.backgroundColor = this.color();
  }

  onMouseLeave(): void {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
`,
    tests: [
      {
        name: 'hovering applies the color',
        fn: (code) => {
          if (!/host\s*:\s*\{[^}]*\(mouseenter\)/.test(code)) {
            return 'Expected host: { \'(mouseenter)\': \'...\' }';
          }
          return true;
        },
      },
      {
        name: 'moving away removes the color',
        fn: (code) => {
          if (!/host\s*:\s*\{[^}]*\(mouseleave\)/.test(code)) {
            return 'Expected host: { \'(mouseleave)\': \'...\' }';
          }
          return true;
        },
      },
      {
        name: 'the background color is what changes',
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
