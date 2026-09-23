import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type HarvestCostParams = {
  label: string;
  amount: number;
  date: string;
};

type Props = {
  visible: boolean;
  saving?: boolean;
  onClose: () => void;
  onConfirm: (params: HarvestCostParams) => Promise<void> | void;
};

export function AddHarvestCostSheet({
  visible,
  saving,
  onClose,
  onConfirm,
}: Props) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  const handleConfirm = async () => {
    if (!label.trim() || !amount) return;
    await onConfirm({
      label: label.trim(),
      amount: Number(amount),
      date: new Date().toISOString(),
    });
    setLabel("");
    setAmount("");
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Ajouter un coût</Text>

          <TextInput
            style={styles.input}
            placeholder="Description (ex: Main d'œuvre)"
            value={label}
            onChangeText={setLabel}
          />
          <TextInput
            style={styles.input}
            placeholder="Montant (DT)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

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
                {saving ? "Ajout..." : "Ajouter"}
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
