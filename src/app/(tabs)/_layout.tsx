import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useColorScheme } from 'react-native';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Premium colors
  const activeColor = '#6366f1'; // Indigo
  const inactiveColor = isDark ? '#9ca3af' : '#6b7280';
  const tabBgColor = isDark ? '#111827' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBgColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: tabBgColor,
          shadowColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: isDark ? '#ffffff' : '#111827',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '학습 대시보드',
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: '학습 교재',
          tabBarLabel: '교재',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="conversation"
        options={{
          title: 'AI 실시간 회화',
          tabBarLabel: '회화 연습',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'mic' : 'mic-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: '학습 진도',
          tabBarLabel: '진도',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
