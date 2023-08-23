import { IMechanic, NewMechanic } from './mechanic.model';

export const sampleWithRequiredData: IMechanic = {
  id: 88806,
};

export const sampleWithPartialData: IMechanic = {
  id: 75385,
  name: 'repurpose',
};

export const sampleWithFullData: IMechanic = {
  id: 45498,
  name: 'synergy Handcrafted intermediate',
};

export const sampleWithNewData: NewMechanic = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
