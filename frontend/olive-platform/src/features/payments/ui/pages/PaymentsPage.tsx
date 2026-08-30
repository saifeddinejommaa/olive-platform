import { useState } from "react";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import Select from "../../../../common/widgets/select/Select";

type Payment = {
  id: number;
  paymentNumber: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  invoiceNumber: string | null;
  supplierName: string | null;
  workerName: string | null;
  reference: string | null;
};

const mockPayments: Payment[] = [];

const paymentMethodOptions = [
  {
    value: "",
    label: "Tous les modes",
  },
  {
    value: "cash",
    label: "Espèces",
  },
  {
    value: "bank_transfer",
    label: "Virement",
  },
  {
    value: "check",
    label: "Chèque",
  },
  {
    value: "other",
    label: "Autre",
  },
];

export default function PaymentsPage() {
  const [pageNumber, setPageNumber] = useState(1);

  // Filtres
  const [paymentNumber, setPaymentNumber] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const columns = [
    {
      key: "paymentNumber" as keyof Payment,
      label: "N° paiement",
    },
    {
      key: "paymentDate" as keyof Payment,
      label: "Date",
    },
    {
      key: "amount" as keyof Payment,
      label: "Montant",
      render: (item: Payment) => `${item.amount.toLocaleString("fr-FR")} €`,
    },
    {
      key: "paymentMethod" as keyof Payment,
      label: "Mode de paiement",
    },
    {
      key: "invoiceNumber" as keyof Payment,
      label: "Facture",
      render: (item: Payment) => item.invoiceNumber ?? "—",
    },
    {
      key: "supplierName" as keyof Payment,
      label: "Fournisseur",
      render: (item: Payment) => item.supplierName ?? "—",
    },
    {
      key: "workerName" as keyof Payment,
      label: "Ouvrier",
      render: (item: Payment) => item.workerName ?? "—",
    },
    {
      key: "reference" as keyof Payment,
      label: "Référence",
      render: (item: Payment) => item.reference ?? "—",
    },
  ];

  const handleSearch = () => {
    setPageNumber(1);

    // TODO:
    // Appel API avec les filtres
  };

  const handleReset = () => {
    setPaymentNumber("");
    setInvoiceId("");
    setPaymentMethod("");
    setPageNumber(1);
  };

  return (
    <div className="feature-page">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Paiements</h1>

          <p className="page-description">Suivi des paiements et règlements.</p>
        </div>

        <Button variant="primary">+ Nouveau paiement</Button>
      </div>

      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="filters">
        <TextInput
          label="N° paiement"
          placeholder="Ex. PAY-2026-001"
          value={paymentNumber}
          onChange={(event) => setPaymentNumber(event.target.value)}
        />

        <TextInput
          label="Facture"
          placeholder="ID facture"
          type="number"
          value={invoiceId}
          onChange={(event) => setInvoiceId(event.target.value)}
        />

        <Select
          label="Mode de paiement"
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value)}
          options={paymentMethodOptions}
        />

        <div className="filter-actions">
          <Button variant="secondary" onClick={handleReset}>
            Réinitialiser
          </Button>

          <Button variant="primary" onClick={handleSearch}>
            Rechercher
          </Button>
        </div>
      </div>

      {/* =====================================================
          TABLE
          ===================================================== */}

      <DataTable
        data={mockPayments}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockPayments.length}
        onPageChange={setPageNumber}
      />
    </div>
  );
}
