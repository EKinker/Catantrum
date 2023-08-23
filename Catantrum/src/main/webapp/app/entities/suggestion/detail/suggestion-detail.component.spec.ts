import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SuggestionDetailComponent } from './suggestion-detail.component';

describe('Suggestion Management Detail Component', () => {
  let comp: SuggestionDetailComponent;
  let fixture: ComponentFixture<SuggestionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuggestionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ suggestion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SuggestionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SuggestionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load suggestion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.suggestion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
