import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useHarvestDetailsStore } from "@olive-platform/core/features/harvests/stores/HarvestDetailsStore";

// NOTE: adapte ce type à ton entité Harvest réelle
// (@olive-platform/core/.../entities/Harvest).
type Props = {
  harvest: {
    id: number;
    reference: string;
    harvestedTrees: number;
    notes?: string | null;
  };
  editable: boolean;
};

export function HarvestGeneralInfoCard({ harvest, editable }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [harvestedTrees, setHarvestedTrees] = useState(
    String(harvest.harvestedTrees ?? ""),
  );
  const [notes, setNotes] = useState(harvest.notes ?? "");

  // NOTE: suppose que le store expose une action `update`, du même type que
  // `start` / `complete`. Ajoute-la côté HarvestDetailsStore si elle
  // n'existe pas encore.
  const update = useHarvestDetailsStore((s: any) => s.update);
  const saving = useHarvestDetailsStore((s: any) => s.saving);

  const handleSave = async () => {
    try {
      await update(harvest.id, {
        harvestedTrees: Number(harvestedTrees) || 0,
        notes,
      });
      setIsEditing(false);
    } catch {
      Alert.alert("Erreur", "Impossible de mettre à jour les informations.");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.field}>Référence</Text>
        <Text style={styles.value}>{harvest.reference}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.field}>Arbres récoltés (cible)</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={harvestedTrees}
            onChangeText={setHarvestedTrees}
          />
        ) : (
          <Text style={styles.value}>{harvest.harvestedTrees}</Text>
        )}
      </View>

      <View style={styles.column}>
        <Text style={styles.field}>Notes</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        ) : (
          <Text style={styles.value}>{harvest.notes || "—"}</Text>
        )}
      </View>

      {editable && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={saving}
        >
          <Text style={styles.editLabel}>
            {isEditing ? "Enregistrer" : "Modifier"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  column: { gap: 6 },
  field: { color: "#777", fontSize: 13 },
  value: { fontSize: 15, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 100,
    textAlign: "right",
  },
  multiline: { minHeight: 60, textAlign: "left" },
  editButton: { alignSelf: "flex-end", paddingVertical: 8, paddingHorizontal: 14 },
  editLabel: { color: "#2E7D32", fontWeight: "600" },
});
