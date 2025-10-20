import { RouterProvider } from "react-router-dom";
import { router } from "./config/routes";
import { AuthProvider, InitProvider, QueryProvider } from "./providers";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <InitProvider>
          <RouterProvider router={router} />
        </InitProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
