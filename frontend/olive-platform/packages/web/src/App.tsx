import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { setAppConstants } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";

import Layout from "./common/widgets/layout/Layout";
import SeasonGate from "./common/widgets/season/SeasonGate";
import { useConstantsStore } from "./stores/ConstantsStore";

// Tableau de bord
import DashboardPage from "./features/dashboard/ui/pages/dashboardPage/DashboardPage";

// Parcelles
import PlotsPage from "./features/plots/ui/pages/PlotsPage";
import PlotDetailPage from "./features/plots/ui/pages/PlotDetailsPage";

// Achats d'olives
import OlivePurchasesPage from "./features/olivePurchases/ui/pages/OlivePurchasesPage";
import NewOlivePurchasePage from "./features/olivePurchases/ui/pages/NewOlivePurchasePage";
import OlivePurchaseDetailsPage from "./features/olivePurchases/ui/pages/OlivePurchaseDetailsPage";

// Récoltes
import HarvestsPage from "./features/harvests/ui/pages/HarvestsPage";
import CreateHarvestPage from "./features/harvests/ui/pages/NewHarvestPage";
import HarvestDetailsPage from "./features/harvests/ui/pages/HarvestDetailsPage";

// Stock d'olives (lots)
import OliveLotsPage from "./features/oliveLots/ui/pages/OliveLotsPage";

// Production (pressions)
import PressingOperationsPage from "./features/production/ui/pages/PressingOperationsPage";
import NewPressingOperationPage from "./features/production/ui/pages/NewPressingOperationPage";
import PressingOperationDetailsPage from "./features/production/ui/pages/PressingOperationsDetailsPage";

// Analyses
import OliveAnalysesPage from "./features/analyses/oliveAnalyses/ui/pages/OliveAnalysesPage";
import NewOliveAnalysisPage from "./features/analyses/oliveAnalyses/ui/pages/NewOliveAnalysisPage";
import OliveAnalysisDetailsPage from "./features/analyses/oliveAnalyses/ui/pages/OliveAnalysisDetailsPage";
import OilAnalysesPage from "./features/analyses/oilAnalyses/ui/pages/OilAnalysesPage";
import NewOilAnalysisPage from "./features/analyses/oilAnalyses/ui/pages/NewOilAnalysisPage";
import OilAnalysisDetailsPage from "./features/analyses/oilAnalyses/ui/pages/OilAnalysisDetailsPage";

// Huile, stockage et finance
import OilMovementsPage from "./features/oilMovements/ui/pages/OilMovementsPage";
import TanksPage from "./features/tanks/ui/pages/TanksPages";
import TankDetailsPage from "./features/tanks/ui/pages/TankDetailsPage";
import OilSalesPage from "./features/oilSales/ui/pages/OilSalesPage";
import NewOilSalePage from "./features/oilSales/ui/pages/NewOilSalePage";
import OilSaleDetailsPage from "./features/oilSales/ui/pages/OilSaleDetailsPage";
import CustomersPage from "./features/customers/ui/pages/CustomersPage";
import IndicatorsPage from "./features/indicators/ui/pages/IndicatorsPage";
import PaymentsPage from "./features/payments/ui/pages/PaymentsPage";

// Système
import SettingsPage from "./features/settings/pages/SettingsPage";

function App() {
  const { fetchConstants } = useConstantsStore();

  setAppConstants(useConstantsStore.getState().Appconstants);

  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  return (
    <>
      <BrowserRouter>
        <SeasonGate>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />

              {/* Parcelles */}
              <Route path="/plots" element={<PlotsPage />} />
              <Route path="/plots/plot-details/:id" element={<PlotDetailPage />} />

              {/* Achats d'olives */}
              <Route path="/olive-purchases" element={<OlivePurchasesPage />} />
              <Route path="/olive-purchases/new" element={<NewOlivePurchasePage />} />
              <Route path="/olive-purchases/:id" element={<OlivePurchaseDetailsPage />} />

              {/* Récoltes */}
              <Route path="/harvests" element={<HarvestsPage />} />
              <Route path="/harvests/new" element={<CreateHarvestPage />} />
              <Route path="/harvests/harvest-operation/:id" element={<HarvestDetailsPage />} />

              {/* Stock d'olives */}
              <Route path="/olive-lots" element={<OliveLotsPage />} />

              {/* Production */}
              <Route path="/production" element={<PressingOperationsPage />} />
              <Route path="/production/new" element={<NewPressingOperationPage />} />
              <Route
                path="/production/pressing-operations/:id"
                element={<PressingOperationDetailsPage />}
              />

              {/* Analyses d'olive */}
              <Route path="/Olive-analyses" element={<OliveAnalysesPage />} />
              <Route path="/Olive-analyses/new" element={<NewOliveAnalysisPage />} />
              <Route path="/Olive-analyses/:id" element={<OliveAnalysisDetailsPage />} />

              {/* Analyses d'huile */}
              <Route path="/Oil-analyses" element={<OilAnalysesPage />} />
              <Route path="/Oil-analyses/new" element={<NewOilAnalysisPage />} />
              <Route path="/Oil-analyses/:id" element={<OilAnalysisDetailsPage />} />

              {/* Huile, stockage et finance */}
              <Route path="/oil-movements" element={<OilMovementsPage />} />
              <Route path="/tanks" element={<TanksPage />} />
              <Route path="/tanks/:id" element={<TankDetailsPage />} />

              {/* Ventes d'huile */}
              <Route path="/oil-sales" element={<OilSalesPage />} />
              <Route path="/oil-sales/new" element={<NewOilSalePage />} />
              <Route path="/oil-sales/:id/edit" element={<NewOilSalePage />} />
              <Route path="/oil-sales/:id" element={<OilSaleDetailsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/indicators" element={<IndicatorsPage />} />
              <Route path="/payments" element={<PaymentsPage />} />

              {/* Système */}
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </SeasonGate>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </>
  );
}

export default App;
