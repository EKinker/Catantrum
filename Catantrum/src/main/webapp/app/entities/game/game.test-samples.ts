import { IGame, NewGame } from './game.model';

export const sampleWithRequiredData: IGame = {
  id: 79326,
};

export const sampleWithPartialData: IGame = {
  id: 42653,
  name: 'Islands Bedfordshire withdrawal',
  maxPlayers: 16458,
  category: 'mobile invoice',
  mechanic: 'transmitter',
};

export const sampleWithFullData: IGame = {
  id: 60784,
  name: 'parse',
  minPlayers: 76216,
  maxPlayers: 34854,
  minAge: 15942,
  category: 'Intelligent',
  userRating: 18211,
  mechanic: 'Associate Officer Shores',
};

export const sampleWithNewData: NewGame = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
