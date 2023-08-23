import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IQuery, NewQuery } from '../query.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IQuery for edit and NewQueryFormGroupInput for create.
 */
type QueryFormGroupInput = IQuery | PartialWithRequiredKeyOf<NewQuery>;

type QueryFormDefaults = Pick<NewQuery, 'id'>;

type QueryFormGroupContent = {
  id: FormControl<IQuery['id'] | NewQuery['id']>;
  mechanic: FormControl<IQuery['mechanic']>;
  category: FormControl<IQuery['category']>;
};

export type QueryFormGroup = FormGroup<QueryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class QueryFormService {
  createQueryFormGroup(query: QueryFormGroupInput = { id: null }): QueryFormGroup {
    const queryRawValue = {
      ...this.getFormDefaults(),
      ...query,
    };
    return new FormGroup<QueryFormGroupContent>({
      id: new FormControl(
        { value: queryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      mechanic: new FormControl(queryRawValue.mechanic),
      category: new FormControl(queryRawValue.category),
    });
  }

  getQuery(form: QueryFormGroup): IQuery | NewQuery {
    return form.getRawValue() as IQuery | NewQuery;
  }

  resetForm(form: QueryFormGroup, query: QueryFormGroupInput): void {
    const queryRawValue = { ...this.getFormDefaults(), ...query };
    form.reset(
      {
        ...queryRawValue,
        id: { value: queryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): QueryFormDefaults {
    return {
      id: null,
    };
  }
}
