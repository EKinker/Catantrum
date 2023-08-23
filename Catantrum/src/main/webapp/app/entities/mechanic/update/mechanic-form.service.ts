import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMechanic, NewMechanic } from '../mechanic.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMechanic for edit and NewMechanicFormGroupInput for create.
 */
type MechanicFormGroupInput = IMechanic | PartialWithRequiredKeyOf<NewMechanic>;

type MechanicFormDefaults = Pick<NewMechanic, 'id'>;

type MechanicFormGroupContent = {
  id: FormControl<IMechanic['id'] | NewMechanic['id']>;
  name: FormControl<IMechanic['name']>;
};

export type MechanicFormGroup = FormGroup<MechanicFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MechanicFormService {
  createMechanicFormGroup(mechanic: MechanicFormGroupInput = { id: null }): MechanicFormGroup {
    const mechanicRawValue = {
      ...this.getFormDefaults(),
      ...mechanic,
    };
    return new FormGroup<MechanicFormGroupContent>({
      id: new FormControl(
        { value: mechanicRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(mechanicRawValue.name),
    });
  }

  getMechanic(form: MechanicFormGroup): IMechanic | NewMechanic {
    return form.getRawValue() as IMechanic | NewMechanic;
  }

  resetForm(form: MechanicFormGroup, mechanic: MechanicFormGroupInput): void {
    const mechanicRawValue = { ...this.getFormDefaults(), ...mechanic };
    form.reset(
      {
        ...mechanicRawValue,
        id: { value: mechanicRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MechanicFormDefaults {
    return {
      id: null,
    };
  }
}
