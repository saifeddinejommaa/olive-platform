import { useState } from "react";

import PaymentTabs from "../components/PaymentTabs";
import type { PaymentTab } from "../components/PaymentTabs";
import PaymentHistoryTab from "../components/PaymentHistoryTab";
import PendingPaymentTab from "../components/PendingPaymentsTab";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] =
    useState<PaymentTab>("pending");
    usePageTitle("Paiements","Suivi des paiements et règlements.")

  return (
    <div className="feature-page">

      <PaymentTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "pending" && (
        <PendingPaymentTab />
      )}

      {activeTab === "history" && (
        <PaymentHistoryTab />
      )}
    </div>
  );
}
