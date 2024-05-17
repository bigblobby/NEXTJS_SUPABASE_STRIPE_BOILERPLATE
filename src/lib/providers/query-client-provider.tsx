'use client';

import {
    QueryClient,
    QueryClientProvider as Provider,
} from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000 * 10,
        },
    },
});

export default function QueryClientProvider({ children }: any) {
    return (
        <Provider client={queryClient}>
            {children}
        </Provider>
    )
}