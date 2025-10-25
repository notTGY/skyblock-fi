"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

const RefetchContext = createContext<{
  refetchInterval: number;
  setRefetchInterval: (interval: number) => void;
}>({
  refetchInterval: 60 * 1000,
  setRefetchInterval: () => {},
});

export function useRefetchInterval() {
  return useContext(RefetchContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const [refetchInterval, setRefetchInterval] = useState(60 * 1000); // 1 minute default

  return (
    <RefetchContext.Provider value={{ refetchInterval, setRefetchInterval }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RefetchContext.Provider>
  );
}
