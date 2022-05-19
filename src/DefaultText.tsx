import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';

type Ref = any;

const DefaultText = React.forwardRef<Ref, TextProps>(
  ({ style, ...otherProps }, ref) => (
    <Text
      ref={ref}
      style={[style, otherProps.onPress && styles.pressable]}
      {...otherProps}
    />
  )
);

export type PressableStyles = { pressable: TextStyle };

export const styles = StyleSheet.create<PressableStyles>({
  pressable: {
    color: '#36BDE8',
    fontWeight: 'bold',
  },
});

export default React.memo(DefaultText);
