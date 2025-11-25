import { AppRouter } from "./config/routes";
import { AuthProvider } from "./providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryConfig } from "./config/app.config";

function App() {
  const queryClient = new QueryClient(queryConfig);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
