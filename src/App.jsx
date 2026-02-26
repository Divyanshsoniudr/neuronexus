import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useStore } from "./store/useStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import BroadcastBanner from "./components/BroadcastBanner";

// Pages
import Landing from "./pages/Landing";
import Discovery from "./pages/Discovery";
import Generator from "./pages/Generator";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";
import ModeratorRoute from "./components/ModeratorRoute";
import Moderator from "./pages/Moderator";
import Roadmap from "./pages/Roadmap";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  const { initAuth } = useStore();

  React.useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <div className="min-h-screen w-full bg-[#050505] text-white selection:bg-indigo-500 selection:text-white flex flex-col">
          <BroadcastBanner />
          <div className="bg-mesh" />
          <Navbar />

          <main className="flex-1 pt-32 pb-20 px-4 md:px-12 flex flex-col items-center justify-center relative z-10">
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />

                {/* Public Roadmap Hub */}
                <Route path="/hub" element={<Discovery />} />
                <Route
                  path="/roadmap/:id"
                  element={
                    <ProtectedRoute>
                      <Roadmap />
                    </ProtectedRoute>
                  }
                />

                {/* Private Routes */}
                <Route
                  path="/generator"
                  element={
                    <ProtectedRoute>
                      <Generator />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz"
                  element={
                    <ProtectedRoute>
                      <Quiz />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/audit"
                  element={
                    <ModeratorRoute>
                      <Moderator />
                    </ModeratorRoute>
                  }
                />

                {/* 404 */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
