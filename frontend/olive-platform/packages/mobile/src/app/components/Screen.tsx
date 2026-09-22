import { Children, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ScreenProps = {
  children?: ReactNode;
};

export function Screen({ children }: ScreenProps) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
});