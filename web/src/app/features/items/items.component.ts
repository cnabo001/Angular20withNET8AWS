import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ItemsStore } from './items.store';

type ItemForm = {
  name: string;
  description: string;
  price: number;
};

@Component({
  selector: 'app-items',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styles:[` :host {
    --bg: #0f172a;          /* slate-900 */
    --card: #111827;        /* gray-900 */
    --muted: #94a3b8;       /* slate-400 */
    --text: #e5e7eb;        /* gray-200 */
    --accent: #22d3ee;      /* cyan-400 */
    --accent-2: #60a5fa;    /* blue-400 */
    --danger: #f43f5e;      /* rose-500 */
    --ring: rgba(34, 211, 238, .35);

    display:block; min-height:100%;
    background: radial-gradient(1200px 600px at 20% -10%, rgba(34,211,238,.08), transparent 60%),
                radial-gradient(900px 500px at 100% 10%, rgba(96,165,250,.10), transparent 65%),
                var(--bg);
    color: var(--text);
  }

  .shell { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
  .header {
    display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1.25rem;
  }
  .title { font-size:1.5rem; font-weight:600; letter-spacing:.2px; }
  .meta { font-size:.9rem; color:var(--muted) }

  /* Card */
  .card {
    background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 16px; padding: 1rem;
    box-shadow: 0 8px 24px rgba(0,0,0,.25);
    backdrop-filter: blur(6px);
  }

  /* Form */
  .create { margin-bottom: 1rem }
  .grid {
    display:grid; gap:.75rem;
    grid-template-columns: 2fr 3fr 140px 120px;
  }
  .grid input {
    width:100%; padding:.65rem .75rem; border-radius:12px; border:1px solid rgba(255,255,255,.08);
    background: rgba(255,255,255,.02); color: var(--text);
    outline: none; transition: box-shadow .15s ease, border-color .15s ease;
  }
  .grid input:focus {
    border-color: var(--accent); box-shadow: 0 0 0 4px var(--ring);
  }
  .btn {
    appearance:none; border:1px solid rgba(255,255,255,.12); border-radius:12px;
    padding:.65rem .9rem; cursor:pointer; background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
    color: var(--text); font-weight:600; letter-spacing:.2px; transition: transform .06s ease, border-color .2s, box-shadow .2s;
  }
  .btn:disabled { opacity:.5; cursor:not-allowed }
  .btn:hover { transform: translateY(-1px); border-color: rgba(255,255,255,.25) }
  .btn--primary { border-color: rgba(34,211,238,.35) }
  .btn--primary:hover { box-shadow: 0 6px 18px rgba(34,211,238,.22) }

  /* List */
  .list { display:grid; gap: .75rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  .item { display:flex; flex-direction:column; gap:.5rem }
  .item__head { display:flex; align-items:center; justify-content:space-between; gap:.5rem }
  .item__name { font-weight:600; }
  .price {
    font-variant-numeric: tabular-nums;
    color:#0b1220; background: linear-gradient(180deg, var(--accent), var(--accent-2));
    padding:.25rem .6rem; border-radius:999px; box-shadow: 0 6px 18px rgba(34,211,238,.25);
  }
  .item__desc { color: var(--muted); line-height:1.25; min-height: 2.2em; }

  .actions { display:flex; gap:.5rem; margin-top:.25rem }
  .link, .danger {
    background: transparent; border:1px solid rgba(255,255,255,.12); color: var(--text);
    padding:.45rem .7rem; border-radius:10px; cursor:pointer; transition: border-color .2s, color .2s, transform .06s;
  }
  .link:hover { border-color: rgba(96,165,250,.55); color: #dbeafe; transform: translateY(-1px) }
  .danger { border-color: rgba(244,63,94,.45); color: #fecdd3 }
  .danger:hover { border-color: rgba(244,63,94,.75); color: #ffe4e6; transform: translateY(-1px) }

  /* Empty + status */
  .note { color: var(--muted); text-align:center; padding: 1.25rem 0 }
  .error { color: #fecaca; }

  @media (max-width: 820px) {
    .grid { grid-template-columns: 1fr; }
  }`],
  template: `
       <div class="shell">
      <div class="header">
        <div>
          <div class="title">Items</div>
          <div class="meta">Total value: {{ store.total() | currency }}</div>
        </div>
      </div>

      <!-- Create -->
      <section class="card create">
        <form [formGroup]="form" (ngSubmit)="onCreate()">
          <div class="grid">
            <input placeholder="Name" formControlName="name" />
            <input placeholder="Description" formControlName="description" />
            <input type="number" step="0.01" placeholder="Price" formControlName="price" />
            <button class="btn btn--primary" type="submit" [disabled]="form.invalid || store.loading()">Add</button>
          </div>
        </form>
      </section>

      @if (store.loading()) { <p class="note">Loading...</p> }
      @if (store.error(); as err) { <p class="note error">{{ err }}</p> }

      <!-- List -->
      @if (store.items().length === 0) {
        <p class="note">No items yet. Add your first item above.</p>
      } @else {
        <section class="list">
          @for (i of store.items(); track i.id) {
            <article class="card item">
              <div class="item__head">
                <div class="item__name">{{ i.name }}</div>
                <span class="price">{{ i.price | currency }}</span>
              </div>
              <div class="item__desc">{{ i.description || '—' }}</div>
              <div class="actions">
                <a class="link" [routerLink]="['/items', i.id]">View</a>
                <button class="danger" type="button" (click)="remove(i.id)">Delete</button>
              </div>
            </article>
          }
        </section>
      }
    </div>
  `
})
export class ItemsComponent {
  form;

  constructor(public store: ItemsStore, private fb: NonNullableFormBuilder) {
    // Strongly-typed, non-nullable controls
    this.form = this.fb.group({
      name: this.fb.control<string>('', {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      description: this.fb.control<string>(''),
      price: this.fb.control<number>(0, {
        validators: [Validators.required, Validators.min(0)]
      })
    });

    // initial load
    this.store.load().subscribe();
  }

  onCreate(): void {
    if (this.form.invalid) return;
    const payload: ItemForm = this.form.getRawValue();
    payload.price = Number(payload.price ?? 0);
    this.store.create(payload).subscribe({
      next: () => this.form.reset({ name: '', description: '', price: 0 }),
      error: (e: any) => alert(e?.message ?? 'Create failed')
    });
  }

  remove(id: string): void {
    if (!confirm('Delete item?')) return;
    this.store.delete(id).subscribe({
      error: (e: any) => alert(e?.message ?? 'Delete failed')
    });
  }
}
