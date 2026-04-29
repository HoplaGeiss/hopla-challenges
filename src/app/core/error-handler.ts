import { ErrorHandler, Injectable, inject } from '@angular/core';
import { PostHogService } from '../services/posthog.service';

@Injectable()
export class AppErrorHandler extends ErrorHandler {
  private readonly posthogService = inject(PostHogService);

  override handleError(error: unknown): void {
    // Monaco fires CancellationError ('Canceled') whenever setValue() interrupts
    // an in-flight TS worker request. This is normal internal behavior, not a bug.
    if (error instanceof Error && error.message === 'Canceled') return;
    if (error instanceof Error) {
      this.posthogService.posthog.capture('$exception', {
        $exception_message: error.message,
        $exception_type: error.name,
        $exception_stack_trace_raw: error.stack,
      });
    }
    super.handleError(error);
  }
}
