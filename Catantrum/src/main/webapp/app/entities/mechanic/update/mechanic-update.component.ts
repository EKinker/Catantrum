import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MechanicFormService, MechanicFormGroup } from './mechanic-form.service';
import { IMechanic } from '../mechanic.model';
import { MechanicService } from '../service/mechanic.service';

@Component({
  selector: 'jhi-mechanic-update',
  templateUrl: './mechanic-update.component.html',
})
export class MechanicUpdateComponent implements OnInit {
  isSaving = false;
  mechanic: IMechanic | null = null;

  editForm: MechanicFormGroup = this.mechanicFormService.createMechanicFormGroup();

  constructor(
    protected mechanicService: MechanicService,
    protected mechanicFormService: MechanicFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mechanic }) => {
      this.mechanic = mechanic;
      if (mechanic) {
        this.updateForm(mechanic);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mechanic = this.mechanicFormService.getMechanic(this.editForm);
    if (mechanic.id !== null) {
      this.subscribeToSaveResponse(this.mechanicService.update(mechanic));
    } else {
      this.subscribeToSaveResponse(this.mechanicService.create(mechanic));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMechanic>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(mechanic: IMechanic): void {
    this.mechanic = mechanic;
    this.mechanicFormService.resetForm(this.editForm, mechanic);
  }
}
