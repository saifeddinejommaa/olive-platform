import { Tabs } from 'expo-router';
import {
  IconHome,
  IconLeaf,
  IconSettings,
  IconShoppingCart,
  IconChartBar,
} from '@tabler/icons-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#8A8A8A',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconHome size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="recolte"
        options={{
          title: 'Récolte',
          tabBarIcon: ({ color, size }) => (
            <IconLeaf size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="production"
        options={{
          title: 'Production',
          tabBarIcon: ({ color, size }) => (
            <IconSettings size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="achat"
        options={{
          title: 'Achat',
          tabBarIcon: ({ color, size }) => (
            <IconShoppingCart size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analyses"
        options={{
          title: 'Analyses',
          tabBarIcon: ({ color, size }) => (
            <IconChartBar size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}