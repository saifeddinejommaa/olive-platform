import { useState } from "react";
import ReactSelect from "react-select";
import "./AutoComplete.css";

type SearchModeProps<T> = {
  useSearch: (query: string) => {
    results: T[];
    loading: boolean;
  };
};

type LocalModeProps<T> = {
  items: T[];
};

type Props<T> = {
  placeholder?: string;
  width?: number | string;
  getLabel: (item: T) => string;
  onSelect: (item: T) => void;
} & (SearchModeProps<T> | LocalModeProps<T>);

export function Autocomplete<T>({
  placeholder = "Rechercher...",
  width = "100%",
  getLabel,
  onSelect,
  ...props
}: Props<T>) {
  const [query, setQuery] = useState("");

  const isSearchMode = "useSearch" in props;

  const searchResult = isSearchMode
    ? props.useSearch(query)
    : {
        loading: false,
        results: props.items.filter((item) =>
          getLabel(item).toLowerCase().includes(query.toLowerCase()),
        ),
      };

  const options = searchResult.results.map((item) => ({
    label: getLabel(item),
    value: item,
  }));

  return (
    <div className="select-field" style={{ width }}>
      <ReactSelect
        classNamePrefix="autocomplete"
        placeholder={placeholder}
        isLoading={searchResult.loading}
        options={options}
        filterOption={() => true}
        isClearable
        onInputChange={(value) => {
          setQuery(value);
          return value;
        }}
        onChange={(selected) => {
          if (selected) onSelect(selected.value);
        }}
      />
    </div>
  );
}
