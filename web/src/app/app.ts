import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template:  `
  <header class="p-4 border-b flex gap-4">{{title()}}</header>
  <div class="p-4 border-b flex gap-4">
    <a routerLink="/items">Items</a>
</div>
  <main class="p-4">
    <router-outlet />
  </main>
  `
})
export class App {
  protected readonly title = signal('Angular 20 zoneless signals to aws .net api');
}
