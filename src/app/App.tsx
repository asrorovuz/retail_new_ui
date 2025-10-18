import { RouterProvider } from "react-router-dom";
import { router } from "./config/routes";
import { AuthProvider, QueryProvider } from "./providers";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
