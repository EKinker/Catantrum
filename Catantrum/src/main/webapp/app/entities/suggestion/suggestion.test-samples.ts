import { ISuggestion, NewSuggestion } from './suggestion.model';

export const sampleWithRequiredData: ISuggestion = {
  id: 22683,
};

export const sampleWithPartialData: ISuggestion = {
  id: 33941,
  result: 'leverage',
};

export const sampleWithFullData: ISuggestion = {
  id: 28566,
  result: 'Research engage',
};

export const sampleWithNewData: NewSuggestion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
