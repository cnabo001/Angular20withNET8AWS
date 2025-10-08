import { Routes } from '@angular/router';
import { ItemsHttp } from './features/items/items.http';
import { ItemsStore } from './features/items/items.store';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'items'
      },
      {
        path: 'items',
        title: 'Items',
        providers: [ItemsHttp, ItemsStore],
        children: [
            {
                path: '',
                loadComponent: () =>
                import('./features/items/items.component').then(m => m.ItemsComponent)
            },
            {
                path: 'items/:id',
                title: 'Item Details',
                loadComponent: () =>
                    import('./features/items/item-detail.component').then(m => m.ItemDetailPageComponent)
            }
            

        ]
        
      },
      {
        path: '**',
        title: 'Not Found',
        loadComponent: () =>
            import('./shared/not-found.component').then(m => m.NotFoundPageComponent)
      }
      
];
