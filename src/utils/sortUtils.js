/**
    * Utility function to sort an array of projects based on sortConfig.
    *
    * @param {Array} projects - Array of project objects
    * @param {Object} sortConfig - { field: string, direction: 'asc' | 'desc' }
    * @returns {Array} New sorted array (Pure function - Immutable)
    */
export const sortProjects = (projects, sortConfig) => {
    if (!Array.isArray(projects) || projects.length <= 1) {
        return projects || [];
    }

    const { field, direction } = sortConfig;
    const modifier = direction === 'desc' ? -1 : 1;

    // Ensure Immutability
    return [...projects].sort((a, b) => {
        const valA = a[field];
        const valB = b[field];

        // 1. Handle null / undefined values (always push nulls to the end)
        if (valA == null && valB == null) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        // 2. Compare based on specific data types
        switch (field) {
            case 'projectNumber':
                // Numeric comparison
                return (Number(valA) - Number(valB)) * modifier;

            case 'startDate':
                // ISO Date string comparison (YYYY-MM-DD)
                return String(valA).localeCompare(String(valB)) * modifier;

            case 'name':
            case 'customer':
            case 'status':
            default:
                // Case-insensitive locale string comparison supporting diacritics
                return (
                    String(valA).localeCompare(String(valB), undefined, {
                        numeric: true,
                        sensitivity: 'base',
                    }) * modifier
                );
        }
    });
};