import { AuthProvider } from "./providers";
import MessageDispatcher from "@/shared/lib/dispatcher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./config/routes";
import { queryConfig } from "./config/app.config";
import { KeyboardProvider } from "./providers/KeyboardProvider";

function App() {
  const queryClient = new QueryClient(queryConfig);

  return (
    <MessageDispatcher>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </MessageDispatcher>
  );
}

export default App;
