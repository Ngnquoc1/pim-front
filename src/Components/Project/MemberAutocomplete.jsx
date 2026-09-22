import React, { useState, useEffect, forwardRef } from "react";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";
import employeeService from "../../services/employeeService";
import TagAutocomplete from "../Common/TagAutocomplete";

/**
 * MemberAutocomplete Component (Thin Wrapper for Project Domain).
 * Connects useDebouncedSearch hook and employeeService with generic TagAutocomplete.
 * Encapsulates visa mapping and deduplication, emitting an array of visa strings.
 */
const formatFullName = (emp) =>
  emp ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim() : "";

const MemberAutocomplete = forwardRef(function MemberAutocomplete(
  {
    value = [],
    initialMembers = [],
    onChange,
    isInvalid = false,
    placeholder,
    disabled = false,
    className = "",
    id,
    name,
  },
  ref
) {
  // 1. Store visa -> employee info mapping in RAM for rendering Tag labels
  const [employeeMap, setEmployeeMap] = useState({});

  useEffect(() => {
    // Initialize employee dictionary from Backend ProjectResponseDto (Edit mode)
    if (initialMembers && initialMembers.length > 0) {
      const map = {};
      initialMembers.forEach((emp) => {
        if (emp.visa) {
          map[emp.visa.toUpperCase()] = emp;
        }
      });
      setEmployeeMap((prev) => ({ ...map, ...prev }));
    }
  }, [initialMembers]);

  // 2. Custom hook for 300ms debounced search with AbortController
  const {
    searchTerm,
    setSearchTerm,
    results,
    isSearching,
    clearSearch,
  } = useDebouncedSearch(employeeService.searchEmployees, 300);

  // 3. Normalize selected visas: support Array natively (fallback to CSV string for backward compatibility)
  const selectedVisas = Array.isArray(value)
    ? value
    : (value || "")
        .split(",")
        .map((v) => v.trim().toUpperCase())
        .filter(Boolean);

  // 4. Deduplicate: Filter out employees already selected as tags
  const existingSet = new Set(selectedVisas);
  const filteredSuggestions = results.filter(
    (emp) => emp.visa && !existingSet.has(emp.visa.toUpperCase())
  );

  // 5. Add employee (emits array of visas)
  const handleAddEmployee = (emp) => {
    if (!emp || !emp.visa) return;
    const visaUpper = emp.visa.toUpperCase();
    if (!selectedVisas.includes(visaUpper)) {
      const updatedVisas = [...selectedVisas, visaUpper];
      setEmployeeMap((prev) => ({ ...prev, [visaUpper]: emp }));
      if (onChange) {
        onChange(updatedVisas);
      }
    }
  };

  // 6. Remove employee (emits array of visas)
  const handleRemoveEmployee = (visaToRemove) => {
    const updatedVisas = selectedVisas.filter((v) => v !== visaToRemove);
    if (onChange) {
      onChange(updatedVisas);
    }
  };

  return (
    <TagAutocomplete
      ref={ref}
      id={id}
      name={name}
      selectedItems={selectedVisas}
      onAddItem={handleAddEmployee}
      onRemoveItem={handleRemoveEmployee}
      getItemKey={(visa) => visa}
      getItemTagLabel={(visa) => {
        const fullName = formatFullName(employeeMap[visa]);
        return fullName ? `${visa}: ${fullName}` : visa;
      }}
      getItemMenuLabel={(emp) => {
        const fullName = formatFullName(emp);
        return fullName ? `${emp.visa}: ${fullName}` : emp.visa;
      }}
      suggestions={filteredSuggestions}
      isSearching={isSearching}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      onClearSearch={clearSearch}
      placeholder={placeholder}
      disabled={disabled}
      isInvalid={isInvalid}
      className={className}
    />
  );
});

export default MemberAutocomplete;
