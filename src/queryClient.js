import { QueryClient } from "@tanstack/react-query";

/**
 * Global QueryClient instance configured for PIM Tool application.
 * Default cache configuration:
 * - staleTime: 60 seconds (data remains fresh in memory for 1 minute)
 * - refetchOnWindowFocus: false (avoids disruptive background refetches on tab switching)
 * - retry: 1 (automatic single retry on transient network errors)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default queryClient;
