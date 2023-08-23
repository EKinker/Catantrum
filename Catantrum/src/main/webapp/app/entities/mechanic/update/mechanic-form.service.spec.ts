import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mechanic.test-samples';

import { MechanicFormService } from './mechanic-form.service';

describe('Mechanic Form Service', () => {
  let service: MechanicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MechanicFormService);
  });

  describe('Service methods', () => {
    describe('createMechanicFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMechanicFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });

      it('passing IMechanic should create a new form with FormGroup', () => {
        const formGroup = service.createMechanicFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          })
        );
      });
    });

    describe('getMechanic', () => {
      it('should return NewMechanic for default Mechanic initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMechanicFormGroup(sampleWithNewData);

        const mechanic = service.getMechanic(formGroup) as any;

        expect(mechanic).toMatchObject(sampleWithNewData);
      });

      it('should return NewMechanic for empty Mechanic initial value', () => {
        const formGroup = service.createMechanicFormGroup();

        const mechanic = service.getMechanic(formGroup) as any;

        expect(mechanic).toMatchObject({});
      });

      it('should return IMechanic', () => {
        const formGroup = service.createMechanicFormGroup(sampleWithRequiredData);

        const mechanic = service.getMechanic(formGroup) as any;

        expect(mechanic).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMechanic should not enable id FormControl', () => {
        const formGroup = service.createMechanicFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMechanic should disable id FormControl', () => {
        const formGroup = service.createMechanicFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
