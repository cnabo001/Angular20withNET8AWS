import { Injectable, signal, computed } from '@angular/core';
import { catchError, tap, of } from 'rxjs';
import { ItemsHttp } from './items.http';
import { Item } from './item.model';

@Injectable({ providedIn: 'root' })
export class ItemsStore {
  readonly items    = signal<Item[]>([]);
  readonly loading  = signal(false);
  readonly error    = signal<string | null>(null);
  readonly selected = signal<Item | null>(null);

  readonly total = computed(() => this.items().reduce((s, i) => s + i.price, 0));

  constructor(private api: ItemsHttp) {}

  load() {
    this.loading.set(true); this.error.set(null);
    return this.api.list().pipe(
      tap(list => this.items.set(list)),
      catchError(err => { this.error.set(err?.message ?? 'Load failed'); return of([] as Item[]); }),
      tap(() => this.loading.set(false)),
    );
  }

  get(id: string) { return this.api.get(id).pipe(tap(i => this.selected.set(i))); }
  create(patch: Partial<Item>) { return this.api.create(patch).pipe(tap(i => this.items.update(xs => [i, ...xs]))); }
  update(id: string, patch: Partial<Item>) {
    return this.api.update(id, patch).pipe(tap(u => this.items.update(xs => xs.map(x => x.id === id ? { ...x, ...u } : x))));
  }
  delete(id: string) { return this.api.delete(id).pipe(tap(() => this.items.update(xs => xs.filter(x => x.id !== id)))); }
}
