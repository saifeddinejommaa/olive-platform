import { Children, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSeasonStore } from '../stores/SeasonStore';

type ScreenProps = {
  children?: ReactNode;
};

export function Screen({ children }: ScreenProps) {
  // Changer de campagne remonte le contenu : ses données sont rechargées.
  const selectedSeasonId = useSeasonStore((state) => state.selectedSeasonId);

  return (
    <View key={selectedSeasonId ?? 'none'} style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
});