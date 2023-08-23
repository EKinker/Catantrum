export interface IQuery {
  id: number;
  mechanic?: string | null;
  category?: string | null;
}

export type NewQuery = Omit<IQuery, 'id'> & { id: null };
