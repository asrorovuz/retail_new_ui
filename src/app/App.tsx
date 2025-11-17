import { RouterProvider } from "react-router-dom";
import { router } from "./config/routes";
import { AuthProvider, QueryProvider } from "./providers";
import MessageDispatcher from "@/shared/lib/dispatcher";

function App() {
  return (
    <MessageDispatcher>
      <QueryProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryProvider>
    </MessageDispatcher>
  );
}

export default App;
