import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type Props = {
  visible: boolean;
  saving?: boolean;
  defaultHarvestedTrees?: number;
  onClose: () => void;
  onConfirm: (quantityKg: number, harvestedTrees: number) => Promise<void> | void;
};

export function CloseHarvestSheet({
  visible,
  saving,
  defaultHarvestedTrees,
  onClose,
  onConfirm,
}: Props) {
  const [quantityKg, setQuantityKg] = useState("");
  const [harvestedTrees, setHarvestedTrees] = useState(
    String(defaultHarvestedTrees ?? ""),
  );

  const handleConfirm = async () => {
    if (!quantityKg) return;
    await onConfirm(Number(quantityKg), Number(harvestedTrees) || 0);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Clôturer la récolte</Text>

          <TextInput
            style={styles.input}
            placeholder="Quantité récoltée (kg)"
            keyboardType="numeric"
            value={quantityKg}
            onChangeText={setQuantityKg}
          />
          <TextInput
            style={styles.input}
            placeholder="Arbres récoltés"
            keyboardType="numeric"
            value={harvestedTrees}
            onChangeText={setHarvestedTrees}
          />

          {/* NOTE: le web gère aussi la création de stocks + le
              déclenchement d'une analyse à la clôture (HarvestStockParams /
              proceedAnalyse). Ajoute les champs correspondants ici si le
              mobile doit couvrir ce même besoin. */}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelLabel}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirm}
              onPress={handleConfirm}
              disabled={saving}
            >
              <Text style={styles.confirmLabel}>
                {saving ? "Clôture..." : "Clôturer"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    gap: 12,
  },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancel: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  cancelLabel: { color: "#666", fontWeight: "600" },
  confirm: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#2E7D32",
  },
  confirmLabel: { color: "#fff", fontWeight: "600" },
});
