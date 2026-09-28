import { useState, useRef, useEffect, useCallback } from "react";

export function useDebouncedSearch(searchFn, delay = 300) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Clear search results and query
  const clearSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setSearchTerm("");
    setResults([]);
    setIsSearching(false);
  }, []);

  // Trigger search with debounce whenever searchTerm changes
  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    debounceTimerRef.current = setTimeout(() => {
      // Cancel previous in-flight request if still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      searchFn(trimmed, abortControllerRef.current.signal)
        .then((response) => {
          const data = response?.data || response || [];
          setResults(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          if (
            err.name !== "CanceledError" &&
            err.name !== "AbortError" &&
            err.code !== "ERR_CANCELED"
          ) {
            console.error("useDebouncedSearch error: ", err);
          }
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, delay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, searchFn, delay]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    results,
    setResults,
    isSearching,
    clearSearch,
  };
}

export default useDebouncedSearch;
