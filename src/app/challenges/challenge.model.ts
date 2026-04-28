export type Category = 'Pipes' | 'Components' | 'Directives' | 'Services' | 'Signals' | 'Forms' | 'RxJS' | 'Routing';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ChallengeTest {
  name: string;
  /** userCode = raw TS source; jsCode = transpiled JS ready for new Function() */
  fn: (userCode: string, jsCode: string) => true | string;
}

export interface Challenge {
  id: number;
  title: string;
  category: Category;
  difficulty: Difficulty;
  description: string;
  starterCode: string;
  solution: string;
  tests: ChallengeTest[];
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}
