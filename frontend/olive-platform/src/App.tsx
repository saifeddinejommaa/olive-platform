import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'

// Layout
import Layout from './common/widgets/layout/Layout'

// Dashboard
import DashboardPage from './features/dashboard/ui/pages/DashboardPage'

// Olive Purchases
import OlivePurchasesPage from './features/olivePurchases/ui/pages/OlivePurchasesPage'
import NewOlivePurchasePage from './features/olivePurchases/ui/pages/NewOlivePurchasePage'
import OlivePurchaseDetailsPage from './features/olivePurchases/ui/pages/OlivePurchaseDetailsPage'

// Payments
import PaymentsPage from './features/payments/ui/pages/PaymentsPage'

// Tanks
import TanksPage from './features/tanks/ui/pages/TanksPages'

// Workers
import WorkersPage from './features/workers/ui/pages/WorkersPage'

// Harvests
import HarvestsPage from './features/haverts/ui/pages/HarvestsPage'

// Production
import ProductionBatchesPage from './features/production/ui/pages/ProductionBatchesPage'

// Oil Movements
import OilMovementsPage from './features/oilMovements/ui/pages/OilMovementsPage'

// Invoices
import InvoicesPage from './features/invoices/pages/InvoicesPage'

// Settings
import SettingsPage from './features/settings/pages/SettingsPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>

          {/* ================================================== */}
          {/* DASHBOARD */}
          {/* ================================================== */}

          <Route
            path="/"
            element={<DashboardPage />}
          />


          {/* ================================================== */}
          {/* OLIVE PURCHASES */}
          {/* ================================================== */}

          <Route
            path="/olive-purchases"
            element={<OlivePurchasesPage />}
          />

          <Route
            path="/olive-purchases/new"
            element={<NewOlivePurchasePage />}
          />

          <Route
            path="/olive-purchases/:id"
            element={<OlivePurchaseDetailsPage />}
          />


          {/* ================================================== */}
          {/* PAYMENTS */}
          {/* ================================================== */}

          <Route
            path="/payments"
            element={<PaymentsPage />}
          />


          {/* ================================================== */}
          {/* TANKS */}
          {/* ================================================== */}

          <Route
            path="/tanks"
            element={<TanksPage />}
          />


          {/* ================================================== */}
          {/* WORKERS */}
          {/* ================================================== */}

          <Route
            path="/workers"
            element={<WorkersPage />}
          />


          {/* ================================================== */}
          {/* HARVESTS */}
          {/* ================================================== */}

          <Route
            path="/harvests"
            element={<HarvestsPage />}
          />


          {/* ================================================== */}
          {/* PRODUCTION */}
          {/* ================================================== */}

          <Route
            path="/production"
            element={<ProductionBatchesPage />}
          />


          {/* ================================================== */}
          {/* OIL MOVEMENTS */}
          {/* ================================================== */}

          <Route
            path="/oil-movements"
            element={<OilMovementsPage />}
          />


          {/* ================================================== */}
          {/* INVOICES */}
          {/* ================================================== */}

          <Route
            path="/invoices"
            element={<InvoicesPage />}
          />


          {/* ================================================== */}
          {/* SETTINGS */}
          {/* ================================================== */}

          <Route
            path="/settings"
            element={<SettingsPage />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App