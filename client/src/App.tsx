import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePremium from "./pages/HomePremium";
import PortfolioShowcasePremium from "./pages/PortfolioShowcasePremium";
import Admin from "./pages/Admin";
import PricingPremium from "./pages/PricingPremium";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={HomePremium} />
      <Route path={"/portfolio"} component={PortfolioShowcasePremium} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/pricing"} component={PricingPremium} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <div className="site-app-shell">
            <div className="admin-space-backdrop site-admin-background" aria-hidden="true">
              <div className="admin-nebula admin-nebula-a" />
              <div className="admin-nebula admin-nebula-b" />
              <div className="admin-starfield" />
              <div className="admin-flight-path admin-flight-path-a" />
              <div className="admin-flight-path admin-flight-path-b" />
              <div className="admin-led-strip admin-led-strip-top" />
              <div className="admin-led-strip admin-led-strip-bottom" />
            </div>
            <div className="site-app-content">
              <Router />
            </div>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
