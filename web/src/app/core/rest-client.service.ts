import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Query = Record<string, string | number | boolean | null | undefined>;

function toParams(q?: Query) {
  if (!q) return undefined;
  let p = new HttpParams();
  for (const [k, v] of Object.entries(q)) if (v != null) p = p.set(k, String(v));
  return p;
}

@Injectable({ providedIn: 'root' })
export abstract class BaseResourceService<T, TId = string> {
  /** Child classes set this, e.g. '/api/items' */
  protected abstract path: string;
  constructor(protected http: HttpClient) {}

  list(query?: Query): Observable<T[]>           
  { 
    return this.http.get<T[]>(this.path, { params: toParams(query) }); 
  }
  
  get(id: TId): Observable<T>
  { 
    return this.http.get<T>(`${this.path}/${id}`); 
  }
  
  create(body: Partial<T>): Observable<T>        
  { 
    return this.http.post<T>(this.path, body); 
  }
  
  update(id: TId, body: Partial<T>): Observable<T> 
  { 
    return this.http.put<T>(`${this.path}/${id}`, body); 
  }
  
  delete(id: TId): Observable<void>              
  { 
    return this.http.delete<void>(`${this.path}/${id}`); 
  }
}
