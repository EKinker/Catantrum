export interface IGame {
  id: number;
  name?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  minAge?: number | null;
  category?: string | null;
  userRating?: number | null;
  mechanic?: string | null;
}

export type NewGame = Omit<IGame, 'id'> & { id: null };
