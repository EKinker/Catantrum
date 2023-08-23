import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISuggestion, NewSuggestion } from '../suggestion.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISuggestion for edit and NewSuggestionFormGroupInput for create.
 */
type SuggestionFormGroupInput = ISuggestion | PartialWithRequiredKeyOf<NewSuggestion>;

type SuggestionFormDefaults = Pick<NewSuggestion, 'id'>;

type SuggestionFormGroupContent = {
  id: FormControl<ISuggestion['id'] | NewSuggestion['id']>;
  result: FormControl<ISuggestion['result']>;
};

export type SuggestionFormGroup = FormGroup<SuggestionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SuggestionFormService {
  createSuggestionFormGroup(suggestion: SuggestionFormGroupInput = { id: null }): SuggestionFormGroup {
    const suggestionRawValue = {
      ...this.getFormDefaults(),
      ...suggestion,
    };
    return new FormGroup<SuggestionFormGroupContent>({
      id: new FormControl(
        { value: suggestionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      result: new FormControl(suggestionRawValue.result),
    });
  }

  getSuggestion(form: SuggestionFormGroup): ISuggestion | NewSuggestion {
    return form.getRawValue() as ISuggestion | NewSuggestion;
  }

  resetForm(form: SuggestionFormGroup, suggestion: SuggestionFormGroupInput): void {
    const suggestionRawValue = { ...this.getFormDefaults(), ...suggestion };
    form.reset(
      {
        ...suggestionRawValue,
        id: { value: suggestionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SuggestionFormDefaults {
    return {
      id: null,
    };
  }
}
