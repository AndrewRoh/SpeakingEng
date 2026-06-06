import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  useColorScheme,
  View,
} from 'react-native';
import { Theme } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const themeColors = isDark ? Theme.colors.dark : Theme.colors.light;

  // Variant Styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: themeColors.primary,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: themeColors.secondary + '1a', // 10% opacity
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: themeColors.primary,
          borderWidth: 1.5,
        };
      case 'danger':
        return {
          backgroundColor: themeColors.error,
          borderColor: 'transparent',
          borderWidth: 0,
        };
    }
  };

  // Text Colors
  const getTextColor = () => {
    if (disabled) return isDark ? '#4b5563' : '#9ca3af';

    switch (variant) {
      case 'primary':
      case 'danger':
        return '#ffffff';
      case 'secondary':
      case 'outline':
        return themeColors.primary;
    }
  };

  // Size Styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, height: 36 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, height: 48 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 16, height: 56 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 13;
      case 'medium':
        return 15;
      case 'large':
        return 17;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyles(),
        getVariantStyles(),
        disabled && (isDark ? styles.disabledDark : styles.disabledLight),
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: getFontSize() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconWrapper: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledLight: {
    backgroundColor: '#e5e7eb',
    borderColor: 'transparent',
  },
  disabledDark: {
    backgroundColor: '#1f2937',
    borderColor: 'transparent',
  },
});
