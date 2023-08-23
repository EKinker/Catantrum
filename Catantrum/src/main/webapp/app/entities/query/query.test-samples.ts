import { IQuery, NewQuery } from './query.model';

export const sampleWithRequiredData: IQuery = {
  id: 85381,
};

export const sampleWithPartialData: IQuery = {
  id: 68510,
};

export const sampleWithFullData: IQuery = {
  id: 61428,
  mechanic: 'Rubber',
  category: 'Namibia Liaison synergistic',
};

export const sampleWithNewData: NewQuery = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
