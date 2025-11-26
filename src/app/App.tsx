
import { RouterProvider } from "react-router-dom";
import { router } from "./config/routes";
import { AuthProvider, QueryProvider } from "./providers";
import MessageDispatcher from "@/shared/lib/dispatcher";

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
