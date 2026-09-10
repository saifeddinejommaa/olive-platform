import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

// Layout
import Layout from "./common/widgets/layout/Layout";

// Dashboard
import DashboardPage from "./features/dashboard/ui/pages/DashboardPage";

// Olive Purchases
import OlivePurchasesPage from "./features/olivePurchases/ui/pages/OlivePurchasesPage";
import NewOlivePurchasePage from "./features/olivePurchases/ui/pages/NewOlivePurchasePage";
import OlivePurchaseDetailsPage from "./features/olivePurchases/ui/pages/OlivePurchaseDetailsPage";

// Payments
import PaymentsPage from "./features/payments/ui/pages/PaymentsPage";

// Tanks
import TanksPage from "./features/tanks/ui/pages/TanksPages";

// Workers
import WorkersPage from "./features/workers/ui/pages/WorkersPage";

// Harvests
import HarvestsPage from "./features/harvests/ui/pages/HarvestsPage";

// Production
import ProductionBatchesPage from "./features/production/ui/pages/PressingOperationsPage";

// Oil Movements
import OilMovementsPage from "./features/oilMovements/ui/pages/OilMovementsPage";

// Invoices
import InvoicesPage from "./features/invoices/pages/InvoicesPage";

// Settings
import SettingsPage from "./features/settings/pages/SettingsPage";
import { useEffect } from "react";
import { useConstantsStore } from "./features/appConstants/ConstantsStore";
import NewPressingOperationPage from "./features/production/ui/pages/NewPressingOperationPage";
import { ToastContainer } from "react-toastify";
import PressingOperationDetailsPage from "./features/production/ui/pages/PressingOperationsDetailsPage";
import CreateHarvestPage from "./features/harvests/ui/pages/NewHarvestPage";
import HarvestDetailsPage from "./features/harvests/ui/pages/HarvestDetailsPage";
import OliveAnalysesPage from "./features/analyses/oliveAnalyses/ui/pages/OliveAnalysesPage";
import NewOliveAnalysisPage from "./features/analyses/oliveAnalyses/ui/pages/NewOliveAnalysisPage";
import OliveAnalysisDetailsPage from "./features/analyses/oliveAnalyses/ui/pages/OliveAnalysisDetailsPage";
import OilAnalysesPage from "./features/analyses/oilAnalyses/ui/pages/OilAnalysesPage";
import OilAnalysisDetailsPage from "./features/analyses/oilAnalyses/ui/pages/OilAnalysisDetailsPage";
import NewOilAnalysisPage from "./features/analyses/oilAnalyses/ui/pages/NewOilAnalysisPage";
import PlotsPage from "./features/plots/ui/pages/PlotsPage";
import PlotDetailPage from "./features/plots/ui/pages/PlotDetailsPage";


function App() {
  const { fetchConstants } = useConstantsStore();

  useEffect(() => {
    fetchConstants();
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* ================================================== */}
            {/* DASHBOARD */}
            {/* ================================================== */}

            <Route path="/" element={<DashboardPage />} />

            <Route path="/plots" element={<PlotsPage />}/>
            <Route
              path="/plots/plot-details/:id"
              element={<PlotDetailPage />}
            />

            {/* ================================================== */}
            {/* OLIVE PURCHASES */}
            {/* ================================================== */}

            <Route path="/olive-purchases" element={<OlivePurchasesPage />} />

            <Route
              path="/olive-purchases/new"
              element={<NewOlivePurchasePage />}
            />

            <Route
              path="/olive-purchases/:id"
              element={<OlivePurchaseDetailsPage />}
            />

            {/* ================================================== */}
            {/* OLIVE Analyses */}
            {/* ================================================== */}
            <Route path="/Olive-analyses" element={<OliveAnalysesPage />} />

            <Route
              path="/Olive-analyses/new"
              element={<NewOliveAnalysisPage />}
            />

            <Route
              path="/Olive-analyses/:id"
              element={<OliveAnalysisDetailsPage />}
            />

            {/* ================================================== */}
            {/* OIL Analyses */}
            {/* ================================================== */}
            <Route path="/Oil-analyses" element={<OilAnalysesPage />} />

            <Route path="/Oil-analyses/new" element={<NewOilAnalysisPage />} />

            <Route
              path="/Oil-analyses/:id"
              element={<OilAnalysisDetailsPage />}
            />

            {/* ================================================== */}
            {/* PAYMENTS */}
            {/* ================================================== */}

            <Route path="/payments" element={<PaymentsPage />} />

            {/* ================================================== */}
            {/* TANKS */}
            {/* ================================================== */}

            <Route path="/tanks" element={<TanksPage />} />

            {/* ================================================== */}
            {/* WORKERS */}
            {/* ================================================== */}

            <Route path="/workers" element={<WorkersPage />} />

            {/* ================================================== */}
            {/* HARVESTS */}
            {/* ================================================== */}

            <Route path="/harvests" element={<HarvestsPage />} />
            <Route path="/harvests/new" element={<CreateHarvestPage />} />
            <Route
              path="harvests/harvest-operation/:id"
              element={<HarvestDetailsPage />}
            />

            {/* ================================================== */}
            {/* PRODUCTION */}
            {/* ================================================== */}

            <Route path="/production" element={<ProductionBatchesPage />} />

            <Route
              path="/production/new"
              element={<NewPressingOperationPage />}
            />
            <Route
              path="/production/pressing-operations/:id"
              element={<PressingOperationDetailsPage />}
            />

            {/* ================================================== */}
            {/* OIL MOVEMENTS */}
            {/* ================================================== */}

            <Route path="/oil-movements" element={<OilMovementsPage />} />

            {/* ================================================== */}
            {/* INVOICES */}
            {/* ================================================== */}

            <Route path="/invoices" element={<InvoicesPage />} />

            {/* ================================================== */}
            {/* SETTINGS */}
            {/* ================================================== */}

            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </>
  );
}

export default App;
