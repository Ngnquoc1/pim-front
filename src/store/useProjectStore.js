import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import counterpart from 'counterpart';
import en from '../locales/en';
import fr from '../locales/fr';
import { STORAGE_KEYS } from '../constants/storage';

// 1. Register translations globally
counterpart.registerTranslations('en', en);
counterpart.registerTranslations('fr', fr);

// 2. Read saved locale from localStorage and synchronize counterpart immediately
const savedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE) || 'en';
counterpart.setLocale(savedLocale);

/**
 * Zustand Store for Client-Side State Management.
 * Manages UI interactions, form search criteria, active locale, pagination page/size, and column sorting.
 * Server-side data (projects list, mutations, groups, employees) is managed by TanStack Query.
 */
export const useProjectStore = create(
  persist(
    (set, get) => ({
      // 1. Client-Side State
      locale: savedLocale,
      searchCriteria: {
        keyword: '',
        status: 'ALL',
        groupLeaderVisa: '',
        memberVisas: [],
        startDateFrom: '',
        startDateTo: '',
        endDateFrom: '',
        endDateTo: '',
      },
      isAdvancedFilterOpen: false,
      pagination: {
        pageNumber: 0,
        pageSize: 10,
      },
      sortConfig: {
        field: 'projectNumber',
        direction: 'asc',
      },

      // 2. Client-Side Actions
      actions: {
        setLocale: (locale) => {
          localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
          counterpart.setLocale(locale);
          set({ locale });
        },

        setSearchCriteria: (criteria) =>
          set((state) => ({
            searchCriteria: {
              ...state.searchCriteria,
              ...criteria,
            },
            pagination: {
              ...state.pagination,
              pageNumber: 0,
            },
          })),

        setIsAdvancedFilterOpen: (isAdvancedFilterOpen) => set({ isAdvancedFilterOpen }),

        resetSearchCriteria: () =>
          set((state) => ({
            searchCriteria: {
              keyword: '',
              status: 'ALL',
              groupLeaderVisa: '',
              memberVisas: [],
              startDateFrom: '',
              startDateTo: '',
              endDateFrom: '',
              endDateTo: '',
            },
            pagination: {
              ...state.pagination,
              pageNumber: 0,
            },
          })),

        setSortConfig: (field) => {
          const state = get();
          const direction =
            state.sortConfig.field === field && state.sortConfig.direction === 'asc'
              ? 'desc'
              : 'asc';
          set({
            sortConfig: { field, direction },
            pagination: { ...state.pagination, pageNumber: 0 },
          });
        },

        resetSortConfig: () =>
          set({
            sortConfig: {
              field: 'projectNumber',
              direction: 'asc',
            },
          }),

        setPage: (pageNumber) =>
          set((state) => ({
            pagination: {
              ...state.pagination,
              pageNumber,
            },
          })),

        setPageSize: (pageSize) =>
          set((state) => ({
            pagination: {
              ...state.pagination,
              pageSize,
              pageNumber: 0,
            },
          })),

        // Backward compatibility bridge for SearchPage and legacy callers
        fetchProjects: async (customParams = {}) => {
          const state = get();
          if (customParams.searchCriteria) {
            state.actions.setSearchCriteria(customParams.searchCriteria);
          }
          if (customParams.page !== undefined) {
            state.actions.setPage(customParams.page);
          }
          if (customParams.size !== undefined) {
            state.actions.setPageSize(customParams.size);
          }
        },
      },
    }),
    {
      name: STORAGE_KEYS.PROJECT_SEARCH,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        searchCriteria: state.searchCriteria,
        isAdvancedFilterOpen: state.isAdvancedFilterOpen,
        pagination: {
          pageNumber: state.pagination.pageNumber,
          pageSize: state.pagination.pageSize,
        },
        sortConfig: state.sortConfig,
      }),
    }
  )
);

// Export convenient selector hooks for components
export const useSearchCriteria = () => useProjectStore((state) => state.searchCriteria);
export const useLocale = () => useProjectStore((state) => state.locale);
export const useSortConfig = () => useProjectStore((state) => state.sortConfig);
export const usePagination = () => useProjectStore((state) => state.pagination);
export const useIsAdvancedFilterOpen = () => useProjectStore((state) => state.isAdvancedFilterOpen);
export const useProjectActions = () => useProjectStore((state) => state.actions);