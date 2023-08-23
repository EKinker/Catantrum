import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../query.test-samples';

import { QueryFormService } from './query-form.service';

describe('Query Form Service', () => {
  let service: QueryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryFormService);
  });

  describe('Service methods', () => {
    describe('createQueryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createQueryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            mechanic: expect.any(Object),
            category: expect.any(Object),
          })
        );
      });

      it('passing IQuery should create a new form with FormGroup', () => {
        const formGroup = service.createQueryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            mechanic: expect.any(Object),
            category: expect.any(Object),
          })
        );
      });
    });

    describe('getQuery', () => {
      it('should return NewQuery for default Query initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createQueryFormGroup(sampleWithNewData);

        const query = service.getQuery(formGroup) as any;

        expect(query).toMatchObject(sampleWithNewData);
      });

      it('should return NewQuery for empty Query initial value', () => {
        const formGroup = service.createQueryFormGroup();

        const query = service.getQuery(formGroup) as any;

        expect(query).toMatchObject({});
      });

      it('should return IQuery', () => {
        const formGroup = service.createQueryFormGroup(sampleWithRequiredData);

        const query = service.getQuery(formGroup) as any;

        expect(query).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IQuery should not enable id FormControl', () => {
        const formGroup = service.createQueryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewQuery should disable id FormControl', () => {
        const formGroup = service.createQueryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
