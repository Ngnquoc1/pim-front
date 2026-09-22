import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Chip from "@mui/material/Chip";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import styles from "./TagAutocomplete.module.css";

/**
 * Generic Reusable TagAutocomplete Component.
 * Uses Material-UI Chip for tags, matching image5.png visual design.
 * Handles keyboard navigation, click outside, and tag deletion.
 */
const TagAutocomplete = forwardRef(function TagAutocomplete(
  {
    selectedItems = [],
    onAddItem,
    onRemoveItem,
    getItemKey = (item) => item,
    getItemTagLabel = (item) => item,
    getItemMenuLabel = (item) => item,
    suggestions = [],
    isSearching = false,
    searchTerm = "",
    onSearchTermChange,
    onClearSearch,
    placeholder,
    disabled = false,
    isInvalid = false,
    className = "",
    id,
    name,
  },
  ref
) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => inputRef.current);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show dropdown when suggestions or loading state changes
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm, suggestions]);

  // Select item from suggestions list
  const handleSelectItem = (item) => {
    if (onAddItem) {
      onAddItem(item);
    }
    if (onClearSearch) {
      onClearSearch();
    }
    setShowDropdown(false);
    setHighlightedIndex(-1);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Keyboard navigation & backspace to remove last tag
  const handleKeyDown = (e) => {
    if (showDropdown && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        return;
      }
      if (e.key === "Enter") {
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          e.preventDefault();
          handleSelectItem(suggestions[highlightedIndex]);
          return;
        }
      }
    }

    if (e.key === "Escape") {
      setShowDropdown(false);
      return;
    }

    // If input is empty and user hits Backspace, remove the last tag
    if (e.key === "Backspace" && !searchTerm && selectedItems.length > 0) {
      const lastItem = selectedItems[selectedItems.length - 1];
      if (onRemoveItem) {
        onRemoveItem(lastItem);
      }
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={styles.autocompleteWrapper} ref={wrapperRef}>
      {/* Outer Tag Box container */}
      <div
        className={`${styles.tagContainer} ${isFocused ? styles.tagContainerFocus : ""
          } ${isInvalid ? styles.isInvalid : ""} ${className}`}
        onClick={handleContainerClick}
      >
        {/* Render selected items using MUI Chip */}
        {selectedItems.map((item) => {
          const key = getItemKey(item);
          const tagLabel = getItemTagLabel(item);

          return (
            <Chip
              key={key}
              label={tagLabel}
              onDelete={!disabled && onRemoveItem ? () => onRemoveItem(item) : undefined}
              size="small"
              variant="outlined"
              sx={{
                height: "22px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #c0c0c0",
                borderRadius: "3px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#333333",
                textTransform: "uppercase",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                cursor: "default",
                "& .MuiChip-label": {
                  paddingLeft: "6px",
                  paddingRight: "4px",
                },
                "& .MuiChip-deleteIcon": {
                  fontSize: "14px",
                  color: "#444444",
                  marginRight: "2px",
                  marginLeft: "2px",
                  "&:hover": {
                    color: "#dc3545",
                  },
                },
              }}
            />
          );
        })}

        {/* Inline input for typing search query */}
        {!disabled && (
          <input
            type="text"
            id={id}
            name={name}
            ref={inputRef}
            value={searchTerm}
            autoComplete="off"
            placeholder={
              selectedItems.length === 0
                ? placeholder || counterpart.translate("projectForm.memberPlaceholder")
                : ""
            }
            className={styles.tagInput}
            onChange={(e) => onSearchTermChange && onSearchTermChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}
      </div>

      {/* Dropdown Suggestions List */}
      {showDropdown && (
        <ul className={styles.suggestionsDropdown}>
          {isSearching && (
            <li className={styles.suggestionStatus}>
              <Translate content="projectForm.searching" />
            </li>
          )}
          {!isSearching && suggestions.length === 0 && (
            <li className={styles.suggestionStatus}>
              <Translate content="projectForm.noEmployeeFound" />
            </li>
          )}
          {!isSearching &&
            suggestions.map((item, index) => {
              const menuLabel = getItemMenuLabel(item);
              const itemKey = getItemKey(item);

              return (
                <li
                  key={itemKey}
                  className={`${styles.suggestionItem} ${index === highlightedIndex ? styles.suggestionItemActive : ""
                    }`}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents input blur before selection
                    handleSelectItem(item);
                  }}
                >
                  {menuLabel}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
});

export default TagAutocomplete;
