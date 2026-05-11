export type Pokemon = {
  name: string;
  sprites?: {
    front_default: string;
  };
  description?: string;
  url?: string;
};

export type FlavorTextEntry = {
  flavor_text: string;
  language: {
    name: string;
  };
};

export type SpeciesData = {
  flavor_text_entries: FlavorTextEntry[];
};

export interface SearchContextType {
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleSearchButtonClick: VoidFunction;
}
