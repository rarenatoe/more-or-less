import React from 'react';

import { MoreOrLess } from '@rntext/more-or-less';
import { Platform, StyleSheet, View } from 'react-native';
import CustomText from './CustomText';

export default function App() {
  return (
    <View style={styles.appContainer}>
      <View style={styles.container} />
      <View style={[styles.container, styles.center]}>
        <MoreOrLess
          containerStyle={styles.textContainer}
          numberOfLines={5}
          textComponent={CustomText}
          textStyle={styles.text}
          textButtonStyle={styles.textButton}
          animated
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem.
        </MoreOrLess>
      </View>
      <View style={styles.container} />
    </View>
  );
}

const fontFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'Menlo',
});

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: 'lightblue', padding: 24 },
  center: { flex: 10 },
  container: {
    flex: 1,
  },
  text: {
    color: 'mediumslateblue',
    fontSize: 18,
    fontFamily,
  },
  textButton: { color: 'darkviolet' },
  textContainer: {
    backgroundColor: 'azure',
    padding: 16,
    borderRadius: 16,
  },
});
