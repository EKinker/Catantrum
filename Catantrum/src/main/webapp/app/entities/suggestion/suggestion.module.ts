import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SuggestionComponent } from './list/suggestion.component';
import { SuggestionDetailComponent } from './detail/suggestion-detail.component';
import { SuggestionUpdateComponent } from './update/suggestion-update.component';
import { SuggestionDeleteDialogComponent } from './delete/suggestion-delete-dialog.component';
import { SuggestionRoutingModule } from './route/suggestion-routing.module';

@NgModule({
  imports: [SharedModule, SuggestionRoutingModule],
  declarations: [SuggestionComponent, SuggestionDetailComponent, SuggestionUpdateComponent, SuggestionDeleteDialogComponent],
})
export class SuggestionModule {}
