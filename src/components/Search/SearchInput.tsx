type SearchInputProps = {
  defaultValue?: string;
};

export const SearchInput = ({ defaultValue }: SearchInputProps) => (
  <input type="text" name="q" defaultValue={defaultValue} />
);

export default SearchInput;
