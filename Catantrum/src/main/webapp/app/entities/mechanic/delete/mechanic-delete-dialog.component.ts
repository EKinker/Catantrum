import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMechanic } from '../mechanic.model';
import { MechanicService } from '../service/mechanic.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mechanic-delete-dialog.component.html',
})
export class MechanicDeleteDialogComponent {
  mechanic?: IMechanic;

  constructor(protected mechanicService: MechanicService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mechanicService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
