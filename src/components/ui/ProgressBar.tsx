import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import { Theme } from '@/constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  showLabel?: boolean;
  color?: string;
  style?: ViewStyle;
}

export default function ProgressBar({
  progress,
  height = 8,
  showLabel = false,
  color,
  style,
}: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const themeColors = isDark ? Theme.colors.dark : Theme.colors.light;
  const barColor = color || themeColors.primary;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.track,
          { height, borderRadius: height / 2 },
          isDark ? styles.trackDark : styles.trackLight,
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: barColor,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, isDark ? styles.labelDark : styles.labelLight]}>
          {Math.round(clampedProgress)}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  track: {
    flex: 1,
    overflow: 'hidden',
  },
  trackLight: {
    backgroundColor: '#e5e7eb',
  },
  trackDark: {
    backgroundColor: '#374151',
  },
  fill: {
    height: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 32,
    textAlign: 'right',
  },
  labelLight: {
    color: '#4b5563',
  },
  labelDark: {
    color: '#d1d5db',
  },
});
