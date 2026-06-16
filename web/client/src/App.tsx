import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import VehicleDetail from "./pages/VehicleDetail";
import TradeIn from "./pages/TradeIn";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ChatBot from "./components/ChatBot";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/catalogo"} component={Catalog} />
      <Route path={"/vehiculo/:id"} component={VehicleDetail} />
      <Route path={"/compramos-tu-coche"} component={TradeIn} />
      <Route path={"/contacto"} component={Contact} />
      <Route path={"/sobre-nosotros"} component={About} />
      <Route path={"/politica-de-privacidad"} component={PrivacyPolicy} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
        <TooltipProvider>
          <Toaster />
          <Router />
          <ChatBot />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
