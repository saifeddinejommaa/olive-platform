
import { ReactNode } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconX } from '@tabler/icons-react-native';

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset?: () => void;
  children?: ReactNode;
};

export function FilterModal({
  visible,
  onClose,
  onApply,
  onReset,
  children,
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filtres</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <IconX size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <View style={styles.content}>
            {children}
          </View>

          {/* Actions */}
          <View style={styles.footer}>
            {onReset && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={onReset}
              >
                <Text style={styles.resetText}>Réinitialiser</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.applyButton}
              onPress={onApply}
            >
              <Text style={styles.applyText}>Appliquer les filtres</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
  ...StyleSheet.absoluteFill,
  backgroundColor: 'rgba(0, 0, 0, 0.35)',
},

  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
  },

  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    padding: 20,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 10,
  },

  resetButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resetText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  applyButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  },

  applyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
