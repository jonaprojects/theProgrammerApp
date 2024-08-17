import React from 'react';
import { Pressable, type PressableProps, StyleProp, ViewStyle, PressableStateCallbackType } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedPressableProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedPressable({ style, lightColor, darkColor, ...otherProps }: ThemedPressableProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  const combinedStyle = (state: PressableStateCallbackType): StyleProp<ViewStyle> => {
    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    return [{ backgroundColor }, resolvedStyle];
  };

  return (
    <Pressable style={combinedStyle} {...otherProps}>
      {otherProps.children}
    </Pressable>
  );
}
