import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { QueryFormService, QueryFormGroup } from './query-form.service';
import { IQuery } from '../query.model';
import { QueryService } from '../service/query.service';

@Component({
  selector: 'jhi-query-update',
  templateUrl: './query-update.component.html',
})
export class QueryUpdateComponent implements OnInit {
  isSaving = false;
  query: IQuery | null = null;

  editForm: QueryFormGroup = this.queryFormService.createQueryFormGroup();

  constructor(
    protected queryService: QueryService,
    protected queryFormService: QueryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ query }) => {
      this.query = query;
      if (query) {
        this.updateForm(query);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const query = this.queryFormService.getQuery(this.editForm);
    if (query.id !== null) {
      this.subscribeToSaveResponse(this.queryService.update(query));
    } else {
      this.subscribeToSaveResponse(this.queryService.create(query));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuery>>): void {
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

  protected updateForm(query: IQuery): void {
    this.query = query;
    this.queryFormService.resetForm(this.editForm, query);
  }
}
