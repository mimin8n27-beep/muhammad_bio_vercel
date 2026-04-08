import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { SceneBackdrop } from "./components/site/SceneBackdrop";
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
            <SceneBackdrop intensity="high" className="site-global-background" />
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
