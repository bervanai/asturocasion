import { Toaster } from "@/components/ui/sonner";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// El resto de páginas se descarga solo al visitarlas, para que la portada cargue más rápido.
const Catalog = lazy(() => import("./pages/Catalog"));
const VehicleDetail = lazy(() => import("./pages/VehicleDetail"));
const TradeIn = lazy(() => import("./pages/TradeIn"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ChatBot = lazy(() => import("./components/ChatBot"));

// El chatbot no es necesario para pintar la página: se carga cuando el navegador queda libre.
function DeferredChatBot() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 2000);
    return () => clearTimeout(t);
  }, []);
  return ready ? (
    <Suspense fallback={null}>
      <ChatBot />
    </Suspense>
  ) : null;
}

function Router() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F5F5F7" }} />}>
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/catalogo"}>{() => <Catalog />}</Route>
      <Route path={"/coches/:brand"}>{(params) => <Catalog brandSlug={params.brand} />}</Route>
      <Route path={"/vehiculo/:id"} component={VehicleDetail} />
      <Route path={"/compramos-tu-coche"} component={TradeIn} />
      <Route path={"/contacto"} component={Contact} />
      <Route path={"/sobre-nosotros"} component={About} />
      <Route path={"/preguntas-frecuentes"} component={FAQ} />
      <Route path={"/politica-de-privacidad"} component={PrivacyPolicy} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <Toaster />
        <Router />
        <DeferredChatBot />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
