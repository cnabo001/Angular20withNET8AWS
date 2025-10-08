import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1 class="text-xl font-semibold">404</h1>
    <p>Page not found.</p>
    <a routerLink="/items" class="underline">Go home</a>
  `
})
export class NotFoundPageComponent {}
