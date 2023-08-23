import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SuggestionFormService, SuggestionFormGroup } from './suggestion-form.service';
import { ISuggestion } from '../suggestion.model';
import { SuggestionService } from '../service/suggestion.service';

@Component({
  selector: 'jhi-suggestion-update',
  templateUrl: './suggestion-update.component.html',
})
export class SuggestionUpdateComponent implements OnInit {
  isSaving = false;
  suggestion: ISuggestion | null = null;

  editForm: SuggestionFormGroup = this.suggestionFormService.createSuggestionFormGroup();

  constructor(
    protected suggestionService: SuggestionService,
    protected suggestionFormService: SuggestionFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ suggestion }) => {
      this.suggestion = suggestion;
      if (suggestion) {
        this.updateForm(suggestion);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const suggestion = this.suggestionFormService.getSuggestion(this.editForm);
    if (suggestion.id !== null) {
      this.subscribeToSaveResponse(this.suggestionService.update(suggestion));
    } else {
      this.subscribeToSaveResponse(this.suggestionService.create(suggestion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISuggestion>>): void {
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

  protected updateForm(suggestion: ISuggestion): void {
    this.suggestion = suggestion;
    this.suggestionFormService.resetForm(this.editForm, suggestion);
  }
}
