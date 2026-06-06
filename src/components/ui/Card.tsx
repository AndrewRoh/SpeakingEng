import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import { Theme } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  noPadding?: boolean;
}

export default function Card({
  children,
  style,
  onPress,
  noPadding = false,
}: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardStyle = [
    styles.card,
    isDark ? styles.cardDark : styles.cardLight,
    noPadding ? styles.noPadding : null,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  cardDark: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    borderWidth: 1,
  },
  noPadding: {
    padding: 0,
  },
});
