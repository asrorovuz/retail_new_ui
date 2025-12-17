// src/app/constants/queryConfig.ts
export const queryConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,       // revalidateOnFocus
      refetchOnReconnect: false,         // revalidateOnReconnect
      staleTime: 0,                       // ma’lumot qancha vaqt eskirmaydi
      cacheTime: 2000,                     // dedupingInterval ga yaqin
      retry: 2,                           // errorRetryCount
      retryDelay: () => 5000, // errorRetryInterval
      onError: (error: any) => {
        console.error("React Query Error:", error);
      },
    },
    mutations: {
      onError: (error: any) => {
        console.error("Mutation Error:", error);
      },
    },
  },
};
