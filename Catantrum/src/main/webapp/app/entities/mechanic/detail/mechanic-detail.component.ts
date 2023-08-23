import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMechanic } from '../mechanic.model';

@Component({
  selector: 'jhi-mechanic-detail',
  templateUrl: './mechanic-detail.component.html',
})
export class MechanicDetailComponent implements OnInit {
  mechanic: IMechanic | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mechanic }) => {
      this.mechanic = mechanic;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
