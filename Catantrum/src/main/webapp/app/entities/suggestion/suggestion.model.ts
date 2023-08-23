export interface ISuggestion {
  id: number;
  result?: string | null;
}

export type NewSuggestion = Omit<ISuggestion, 'id'> & { id: null };
