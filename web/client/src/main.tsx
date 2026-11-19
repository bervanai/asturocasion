import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// La web pública lee los datos directamente de Supabase (ver lib/supabase.ts).
// El cliente tRPC de la plantilla se quitó: llamaba a /api/trpc, que no existe en
// producción, y añadía peso al bundle en cada visita.
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
