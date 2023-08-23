import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuery } from '../query.model';

@Component({
  selector: 'jhi-query-detail',
  templateUrl: './query-detail.component.html',
})
export class QueryDetailComponent implements OnInit {
  query: IQuery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ query }) => {
      this.query = query;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
