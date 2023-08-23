import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MechanicComponent } from '../list/mechanic.component';
import { MechanicDetailComponent } from '../detail/mechanic-detail.component';
import { MechanicUpdateComponent } from '../update/mechanic-update.component';
import { MechanicRoutingResolveService } from './mechanic-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mechanicRoute: Routes = [
  {
    path: '',
    component: MechanicComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MechanicDetailComponent,
    resolve: {
      mechanic: MechanicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MechanicUpdateComponent,
    resolve: {
      mechanic: MechanicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MechanicUpdateComponent,
    resolve: {
      mechanic: MechanicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mechanicRoute)],
  exports: [RouterModule],
})
export class MechanicRoutingModule {}
