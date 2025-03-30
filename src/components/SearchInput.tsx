import { debounce } from 'lodash';
import { FunctionComponent, useState, useEffect, useRef } from 'react';

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  delay?: number;
  autoFocus?: boolean;
  isMobile?: boolean;
}

const SearchInput: FunctionComponent<SearchInputProps> = ({ 
  onSearch, 
  placeholder = 'חיפוש...', 
  delay = 300,
  autoFocus = true,
  isMobile = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = debounce((term: string) => {
    onSearch(term);
  }, delay);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, isMobile ? 300 : 0);
    }
  }, [autoFocus, isMobile]);

  return (
    <div className={`input-group ${isMobile ? 'input-group-sm' : ''}`}>
      <span className="input-group-text">
        <i className="fas fa-search"></i>
      </span>
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => {
            setSearchTerm('');
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  );
};

export default SearchInput;

