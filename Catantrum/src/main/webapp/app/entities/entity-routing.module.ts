import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'game',
        data: { pageTitle: 'catantrumApp.game.home.title' },
        loadChildren: () => import('./game/game.module').then(m => m.GameModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'catantrumApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'mechanic',
        data: { pageTitle: 'catantrumApp.mechanic.home.title' },
        loadChildren: () => import('./mechanic/mechanic.module').then(m => m.MechanicModule),
      },
      {
        path: 'query',
        data: { pageTitle: 'catantrumApp.query.home.title' },
        loadChildren: () => import('./query/query.module').then(m => m.QueryModule),
      },
      {
        path: 'suggestion',
        data: { pageTitle: 'catantrumApp.suggestion.home.title' },
        loadChildren: () => import('./suggestion/suggestion.module').then(m => m.SuggestionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
