import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class AppErrorHandler extends ErrorHandler {
  override handleError(error: unknown): void {
    // Monaco fires CancellationError ('Canceled') whenever setValue() interrupts
    // an in-flight TS worker request. This is normal internal behavior, not a bug.
    if (error instanceof Error && error.message === 'Canceled') return;
    super.handleError(error);
  }
}
