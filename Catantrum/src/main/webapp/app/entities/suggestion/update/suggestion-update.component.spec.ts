import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SuggestionFormService } from './suggestion-form.service';
import { SuggestionService } from '../service/suggestion.service';
import { ISuggestion } from '../suggestion.model';

import { SuggestionUpdateComponent } from './suggestion-update.component';

describe('Suggestion Management Update Component', () => {
  let comp: SuggestionUpdateComponent;
  let fixture: ComponentFixture<SuggestionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let suggestionFormService: SuggestionFormService;
  let suggestionService: SuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SuggestionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SuggestionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SuggestionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    suggestionFormService = TestBed.inject(SuggestionFormService);
    suggestionService = TestBed.inject(SuggestionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const suggestion: ISuggestion = { id: 456 };

      activatedRoute.data = of({ suggestion });
      comp.ngOnInit();

      expect(comp.suggestion).toEqual(suggestion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISuggestion>>();
      const suggestion = { id: 123 };
      jest.spyOn(suggestionFormService, 'getSuggestion').mockReturnValue(suggestion);
      jest.spyOn(suggestionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ suggestion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: suggestion }));
      saveSubject.complete();

      // THEN
      expect(suggestionFormService.getSuggestion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(suggestionService.update).toHaveBeenCalledWith(expect.objectContaining(suggestion));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISuggestion>>();
      const suggestion = { id: 123 };
      jest.spyOn(suggestionFormService, 'getSuggestion').mockReturnValue({ id: null });
      jest.spyOn(suggestionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ suggestion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: suggestion }));
      saveSubject.complete();

      // THEN
      expect(suggestionFormService.getSuggestion).toHaveBeenCalled();
      expect(suggestionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISuggestion>>();
      const suggestion = { id: 123 };
      jest.spyOn(suggestionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ suggestion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(suggestionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
