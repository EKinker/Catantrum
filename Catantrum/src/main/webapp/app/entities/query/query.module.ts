import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { QueryComponent } from './list/query.component';
import { QueryDetailComponent } from './detail/query-detail.component';
import { QueryUpdateComponent } from './update/query-update.component';
import { QueryDeleteDialogComponent } from './delete/query-delete-dialog.component';
import { QueryRoutingModule } from './route/query-routing.module';

@NgModule({
  imports: [SharedModule, QueryRoutingModule],
  declarations: [QueryComponent, QueryDetailComponent, QueryUpdateComponent, QueryDeleteDialogComponent],
})
export class QueryModule {}
