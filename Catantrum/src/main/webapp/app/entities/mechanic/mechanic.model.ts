export interface IMechanic {
  id: number;
  name?: string | null;
}

export type NewMechanic = Omit<IMechanic, 'id'> & { id: null };
