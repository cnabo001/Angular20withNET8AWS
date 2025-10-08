import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { ItemsStore } from './items.store';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/items" class="underline">← Back</a>

    @if (loading()) { <p>Loading...</p> }
    @if (store.selected(); as s) {  
      <section class="mt-3 border p-3">
        <h2 class="font-semibold">{{ s.name }}</h2>
        <p>{{ s.description }}</p>
        <p class="mt-2">{{ s.price | currency }}</p>
      </section>
    } @else {
      <p>No item.</p>
    }
  `
})
export class ItemDetailPageComponent {
  private route = inject(ActivatedRoute);
  readonly store = inject(ItemsStore);
  readonly loading = signal(true);

  private id = toSignal(
    this.route.paramMap.pipe(
      map(m => m.get('id')),
      filter((x): x is string => !!x)
    ),
    { initialValue: null }
  );

  constructor() {
    effect(() => {
      const itemId = this.id();
      if (!itemId) return;
      this.loading.set(true);
      this.store.get(itemId).subscribe({
        next: () => this.loading.set(false),
        error: () => this.loading.set(false)
      });
    });
  }
}
