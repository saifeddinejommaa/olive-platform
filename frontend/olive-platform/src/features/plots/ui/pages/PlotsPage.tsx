// src/features/production/plots/presentation/pages/PlotsPage.tsx

import { useEffect } from "react";
import DataTable from "../../../../common/widgets/tables/OrdersTable";
import { useNavigate } from "react-router-dom";
import type { PlotsRequestFilter } from "../../domain/entities/PlotsRequestFilter";
import { usePlotsStore } from "../stores/UsePlotsStore";
import type { PlotForList } from "../../domain/entities/PlotForList";
import ProgressBar from "../../../../common/widgets/progressBar/ProgressBar";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import PlotsFilterComponent from "../Components/PlotsFilterComponent";
import ActionCard from "../../../../common/widgets/actionCard/ActionCard";

export default function PlotsPage() {
  const navigate = useNavigate();

  usePageTitle("Parcelles", "Liste des parcelles");
  const { fetchPlots, error, setFilter, Plots, filters, loading } = usePlotsStore();

  useEffect(() => {
    fetchPlots();
  }, []);

  const updateFilter = (field: keyof PlotsRequestFilter, value: string) => {
    setFilter(field, value);
  };

  const handleSearch = async () => {
    await fetchPlots();
  };

  const handleReset = async () => {
    setFilter("reference", "");
    setFilter("name", "");
    setFilter("pageNumber", 1);
    await fetchPlots();
  };

  const handlePageChange = async (pageNumber: number) => {
    setFilter("pageNumber", pageNumber);
    await fetchPlots();
  };

  const handleOpenDetails = (id: number) => {
    navigate(`/plots/plot-details/${id}`);
  };

  const columns = [
    {
      key: "reference" as keyof PlotForList,
      label: "Référence",
    },
    {
      key: "name" as keyof PlotForList,
      label: "Nom",
    },
    {
      key: "numberOfTrees" as keyof PlotForList,
      label: "Nbr Totale",
    },
    {
      key: "harvestedTreesPercentage" as keyof PlotForList,
      label: "% Récolté",
      render: (item: PlotForList) => (
        <ProgressBar
          value={item.harvestedTreesPercentage}
          secondaryValue={item.plannedTreesPercentage}
          showValue
        />
      ),
    },
    {
      key: "id" as keyof PlotForList,
      label: "Actions",
      render: (item: PlotForList) => (
        <div style={{ display: "flex", gap: "4px" }}>
          <ActionCard title="Détails" type="edit" onClick={() => handleOpenDetails(item.id)}></ActionCard>
          
          {item.canLaunchHarvest && (
            <ActionCard type="launch" title="Lancer Récolte" onClick={() => {}}></ActionCard>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="feature-page">
      <PlotsFilterComponent
        filters={filters}
        loading={loading}
        onFilterChange={updateFilter}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <DataTable
        data={Plots?.items ?? []}
        columns={columns}
        pageNumber={Plots?.pageNumber ?? 1}
        pageSize={Plots?.pageSize ?? 10}
        totalCount={Plots?.totalCount ?? 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
}