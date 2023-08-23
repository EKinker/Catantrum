import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISuggestion } from '../suggestion.model';

@Component({
  selector: 'jhi-suggestion-detail',
  templateUrl: './suggestion-detail.component.html',
})
export class SuggestionDetailComponent implements OnInit {
  suggestion: ISuggestion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ suggestion }) => {
      this.suggestion = suggestion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
