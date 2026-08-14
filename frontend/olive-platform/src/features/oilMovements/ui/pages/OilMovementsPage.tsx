import { useState } from "react";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import Select from "../../../../common/widgets/select/Select";

type OilMovement = {
  id: number;
  movementNumber: string;
  movementType: string;
  movementDate: string;
  oilBatchNumber: string | null;
  sourceTankCode: string | null;
  destinationTankCode: string | null;
  quantityLiters: number;
};

const mockOilMovements: OilMovement[] = [];

const movementTypeOptions = [
  {
    value: "",
    label: "Tous les types",
  },
  {
    value: "production_in",
    label: "Entrée production",
  },
  {
    value: "transfer_in",
    label: "Entrée transfert",
  },
  {
    value: "transfer_out",
    label: "Sortie transfert",
  },
  {
    value: "sale_out",
    label: "Sortie vente",
  },
  {
    value: "loss",
    label: "Perte",
  },
  {
    value: "adjustment",
    label: "Ajustement",
  },
];

export default function OilMovementsPage() {
  const [pageNumber, setPageNumber] = useState(1);

  const [movementNumber, setMovementNumber] = useState("");
  const [movementType, setMovementType] = useState("");
  const [oilBatchNumber, setOilBatchNumber] = useState("");
  const [tankCode, setTankCode] = useState("");

  const columns = [
    {
      key: "movementNumber" as keyof OilMovement,
      label: "N° mouvement",
    },
    {
      key: "movementType" as keyof OilMovement,
      label: "Type",
      render: (item: OilMovement) => {
        switch (item.movementType) {
          case "production_in":
            return "Entrée production";

          case "transfer_in":
            return "Entrée transfert";

          case "transfer_out":
            return "Sortie transfert";

          case "sale_out":
            return "Sortie vente";

          case "loss":
            return "Perte";

          case "adjustment":
            return "Ajustement";

          default:
            return item.movementType;
        }
      },
    },
    {
      key: "movementDate" as keyof OilMovement,
      label: "Date",
    },
    {
      key: "oilBatchNumber" as keyof OilMovement,
      label: "Lot d'huile",
      render: (item: OilMovement) =>
        item.oilBatchNumber ?? "—",
    },
    {
      key: "sourceTankCode" as keyof OilMovement,
      label: "Source",
      render: (item: OilMovement) =>
        item.sourceTankCode ?? "—",
    },
    {
      key: "destinationTankCode" as keyof OilMovement,
      label: "Destination",
      render: (item: OilMovement) =>
        item.destinationTankCode ?? "—",
    },
    {
      key: "quantityLiters" as keyof OilMovement,
      label: "Quantité",
      render: (item: OilMovement) =>
        `${item.quantityLiters.toLocaleString("fr-FR")} L`,
    },
  ];

  const handleSearch = () => {
    console.log({
      movementNumber,
      movementType,
      oilBatchNumber,
      tankCode,
    });

    setPageNumber(1);

    // Plus tard :
    // appel API avec les filtres
  };

  const handleReset = () => {
    setMovementNumber("");
    setMovementType("");
    setOilBatchNumber("");
    setTankCode("");
    setPageNumber(1);
  };

  return (
    <div className="feature-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="page-header">

        <div className="page-header-content">

          <h1 className="page-title">
            Mouvements d'huile
          </h1>

          <p className="page-description">
            Entrées, transferts, sorties et ajustements de stock.
          </p>

        </div>

        <Button variant="primary">
          + Nouveau mouvement
        </Button>

      </div>


      {/* =====================================================
          FILTERS
          ===================================================== */}

      <div className="filters">

        <TextInput
          label="N° mouvement"
          placeholder="Ex. MOV-2026-001"
          value={movementNumber}
          onChange={(event) =>
            setMovementNumber(event.target.value)
          }
        />

        <Select
          label="Type"
          value={movementType}
          onChange={(event) =>
            setMovementType(event.target.value)
          }
          options={movementTypeOptions}
        />

        <TextInput
          label="Lot d'huile"
          placeholder="Ex. LOT-2026-001"
          value={oilBatchNumber}
          onChange={(event) =>
            setOilBatchNumber(event.target.value)
          }
        />

        <TextInput
          label="Citerne"
          placeholder="Ex. TANK-01"
          value={tankCode}
          onChange={(event) =>
            setTankCode(event.target.value)
          }
        />

        <div className="filter-actions">

          <Button
            variant="secondary"
            onClick={handleReset}
          >
            Réinitialiser
          </Button>

          <Button
            variant="primary"
            onClick={handleSearch}
          >
            Rechercher
          </Button>

        </div>

      </div>


      {/* =====================================================
          TABLE
          ===================================================== */}

      <DataTable
        data={mockOilMovements}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={10}
        totalCount={mockOilMovements.length}
        onPageChange={setPageNumber}
      />

    </div>
  );
}