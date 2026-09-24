import { useEffect } from "react";
import { useRouter } from "expo-router";

import { usePressingOperationsStore } from "@olive-platform/core/features/production/stores/pressingOperationStore";
import { ListScreen } from "../../components/ListScreen";


import { PressingOperationListItem } from "./widgets/PressingOperationListItem";

export const ProductionPage = () => {
  const router = useRouter();

  const {
    PressingOperations,
    loading,
    error,
    fetchPressingOperations
  } = usePressingOperationsStore();

  useEffect(() => {
    fetchPressingOperations();
  }, [PressingOperations]);

  return (
    <ListScreen
      title="Production"
      description="Gérez les opérations de pression"
      data={PressingOperations.items}
      keyExtractor={(item) =>
        item.id.toString()
      }
      onCreate={() => {
        console.log("Créer une production");
      }}
      renderItem={({ item }) => (
        <PressingOperationListItem
          operation={item}
          onPress={(production) =>
            router.push({
              pathname: "/production/[id]",
              params: {
                id: production.id.toString(),
              },
            })
          }
        />
      )}
      emptyTitle={
        loading
          ? "Chargement..."
          : error
            ? "Impossible de charger les productions"
            : "Aucune production"
      }
      emptyDescription={
        error ??
        "Aucune production ne correspond aux filtres actuels."
      }
      filterContent={
        <></>
      }
    />
  );
};