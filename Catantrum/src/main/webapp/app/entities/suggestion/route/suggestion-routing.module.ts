import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SuggestionComponent } from '../list/suggestion.component';
import { SuggestionDetailComponent } from '../detail/suggestion-detail.component';
import { SuggestionUpdateComponent } from '../update/suggestion-update.component';
import { SuggestionRoutingResolveService } from './suggestion-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const suggestionRoute: Routes = [
  {
    path: '',
    component: SuggestionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SuggestionDetailComponent,
    resolve: {
      suggestion: SuggestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SuggestionUpdateComponent,
    resolve: {
      suggestion: SuggestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SuggestionUpdateComponent,
    resolve: {
      suggestion: SuggestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(suggestionRoute)],
  exports: [RouterModule],
})
export class SuggestionRoutingModule {}
