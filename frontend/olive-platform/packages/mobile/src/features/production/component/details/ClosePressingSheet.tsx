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
  defaultOperationNumber?: string;
  onClose: () => void;
  onConfirm: (
    operationNumber: string,
    oilQuantityLiters: number,
  ) => Promise<void> | void;
};

export function ClosePressingSheet({
  visible,
  saving,
  defaultOperationNumber,
  onClose,
  onConfirm,
}: Props) {
  const [operationNumber, setOperationNumber] = useState(
    defaultOperationNumber ?? "",
  );
  const [oilQuantityLiters, setOilQuantityLiters] = useState("");

  const handleConfirm = async () => {
    if (!operationNumber || !oilQuantityLiters) return;
    await onConfirm(operationNumber, Number(oilQuantityLiters));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Clôturer le pressurage</Text>

          <TextInput
            style={styles.input}
            placeholder="N° d'opération"
            value={operationNumber}
            onChangeText={setOperationNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Huile produite (L)"
            keyboardType="numeric"
            value={oilQuantityLiters}
            onChangeText={setOilQuantityLiters}
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