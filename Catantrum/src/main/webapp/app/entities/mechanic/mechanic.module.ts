import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MechanicComponent } from './list/mechanic.component';
import { MechanicDetailComponent } from './detail/mechanic-detail.component';
import { MechanicUpdateComponent } from './update/mechanic-update.component';
import { MechanicDeleteDialogComponent } from './delete/mechanic-delete-dialog.component';
import { MechanicRoutingModule } from './route/mechanic-routing.module';

@NgModule({
  imports: [SharedModule, MechanicRoutingModule],
  declarations: [MechanicComponent, MechanicDetailComponent, MechanicUpdateComponent, MechanicDeleteDialogComponent],
})
export class MechanicModule {}
