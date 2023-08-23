import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { QueryFormService } from './query-form.service';
import { QueryService } from '../service/query.service';
import { IQuery } from '../query.model';

import { QueryUpdateComponent } from './query-update.component';

describe('Query Management Update Component', () => {
  let comp: QueryUpdateComponent;
  let fixture: ComponentFixture<QueryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let queryFormService: QueryFormService;
  let queryService: QueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [QueryUpdateComponent],
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
      .overrideTemplate(QueryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QueryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    queryFormService = TestBed.inject(QueryFormService);
    queryService = TestBed.inject(QueryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const query: IQuery = { id: 456 };

      activatedRoute.data = of({ query });
      comp.ngOnInit();

      expect(comp.query).toEqual(query);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuery>>();
      const query = { id: 123 };
      jest.spyOn(queryFormService, 'getQuery').mockReturnValue(query);
      jest.spyOn(queryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ query });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: query }));
      saveSubject.complete();

      // THEN
      expect(queryFormService.getQuery).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(queryService.update).toHaveBeenCalledWith(expect.objectContaining(query));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuery>>();
      const query = { id: 123 };
      jest.spyOn(queryFormService, 'getQuery').mockReturnValue({ id: null });
      jest.spyOn(queryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ query: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: query }));
      saveSubject.complete();

      // THEN
      expect(queryFormService.getQuery).toHaveBeenCalled();
      expect(queryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IQuery>>();
      const query = { id: 123 };
      jest.spyOn(queryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ query });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(queryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
