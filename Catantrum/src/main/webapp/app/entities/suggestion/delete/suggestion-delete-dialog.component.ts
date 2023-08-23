import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISuggestion } from '../suggestion.model';
import { SuggestionService } from '../service/suggestion.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './suggestion-delete-dialog.component.html',
})
export class SuggestionDeleteDialogComponent {
  suggestion?: ISuggestion;

  constructor(protected suggestionService: SuggestionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.suggestionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
