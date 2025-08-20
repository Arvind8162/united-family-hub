import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/SupabaseAuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/SupabaseProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Directory from "./pages/Directory";
import Family from "./pages/Family";
import Job from "./pages/Job";
import Donation from "./pages/Donation";
import Contact from "./pages/Contact";
import Classified from "./pages/Classified";
import Community from "./pages/Community";
import BuySell from "./pages/BuySell";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <div className="flex-1">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/directory" element={<Directory />} />
                        <Route path="/family" element={<Family />} />
                        <Route path="/job" element={<Job />} />
                        <Route path="/donation" element={<Donation />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/classified" element={<Classified />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/buy-sell" element={<BuySell />} />
                        <Route path="/admin" element={
                          <ProtectedRoute adminOnly>
                            <Admin />
                          </ProtectedRoute>
                        } />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                    <Footer />
                  </>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
