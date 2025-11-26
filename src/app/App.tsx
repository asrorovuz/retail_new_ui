import { AuthProvider } from "./providers";
import MessageDispatcher from "@/shared/lib/dispatcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./config/routes";
import { queryConfig } from "./config/app.config";

function App() {
  const queryClient = new QueryClient(queryConfig);

  return (
    <MessageDispatcher>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </QueryClientProvider>
    </MessageDispatcher>
  );
}

export default App;
