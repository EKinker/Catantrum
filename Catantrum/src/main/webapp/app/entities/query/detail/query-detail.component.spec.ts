import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { QueryDetailComponent } from './query-detail.component';

describe('Query Management Detail Component', () => {
  let comp: QueryDetailComponent;
  let fixture: ComponentFixture<QueryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ query: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(QueryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(QueryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load query on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.query).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
