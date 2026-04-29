import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostHogService } from './services/posthog.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly posthogService = inject(PostHogService);

  ngOnInit(): void {
    this.posthogService.init(environment.posthogKey, {
      api_host: environment.posthogHost,
      capture_exceptions: true,
    });
  }
}
