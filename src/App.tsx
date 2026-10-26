import { Navigate, Route, Routes } from "react-router";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import PreferencesPage from "./pages/PreferencesPage";
import DiscoveryPage from "./pages/DiscoveryPage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="preferences" element={<PreferencesPage />} />
        <Route path="discover" element={<DiscoveryPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}