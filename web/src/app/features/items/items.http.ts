import { Injectable } from '@angular/core';
import { BaseResourceService } from '../../core/rest-client.service';
import { Item } from './item.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ItemsHttp extends BaseResourceService<Item, string> {
  protected override path = '/api/StoreItems'; // exact, case-sensitive

  constructor(http: HttpClient) { super(http); }

  // unwrap { items: Item[] } -> Item[]
  override list(): Observable<Item[]> {
    return this.http.get<{ items: Item[] }>(this.path).pipe(
      map((r:any) => r.items ?? [])
    );
  }
}
