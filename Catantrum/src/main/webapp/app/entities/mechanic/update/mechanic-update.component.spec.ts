import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MechanicFormService } from './mechanic-form.service';
import { MechanicService } from '../service/mechanic.service';
import { IMechanic } from '../mechanic.model';

import { MechanicUpdateComponent } from './mechanic-update.component';

describe('Mechanic Management Update Component', () => {
  let comp: MechanicUpdateComponent;
  let fixture: ComponentFixture<MechanicUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mechanicFormService: MechanicFormService;
  let mechanicService: MechanicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MechanicUpdateComponent],
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
      .overrideTemplate(MechanicUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MechanicUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mechanicFormService = TestBed.inject(MechanicFormService);
    mechanicService = TestBed.inject(MechanicService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mechanic: IMechanic = { id: 456 };

      activatedRoute.data = of({ mechanic });
      comp.ngOnInit();

      expect(comp.mechanic).toEqual(mechanic);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMechanic>>();
      const mechanic = { id: 123 };
      jest.spyOn(mechanicFormService, 'getMechanic').mockReturnValue(mechanic);
      jest.spyOn(mechanicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mechanic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mechanic }));
      saveSubject.complete();

      // THEN
      expect(mechanicFormService.getMechanic).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mechanicService.update).toHaveBeenCalledWith(expect.objectContaining(mechanic));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMechanic>>();
      const mechanic = { id: 123 };
      jest.spyOn(mechanicFormService, 'getMechanic').mockReturnValue({ id: null });
      jest.spyOn(mechanicService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mechanic: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mechanic }));
      saveSubject.complete();

      // THEN
      expect(mechanicFormService.getMechanic).toHaveBeenCalled();
      expect(mechanicService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMechanic>>();
      const mechanic = { id: 123 };
      jest.spyOn(mechanicService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mechanic });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mechanicService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
