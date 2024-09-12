import React from 'react';

import { MoreOrLess } from 'react-native-more-or-less-text';
import { Button, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import CustomText from './CustomText';

const text1 = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem.`;
const text2 =
  "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures.";
export default function App() {
  const [flag, setFlag] = React.useState(true);

  return (
    <SafeAreaView style={styles.appContainer}>
      <Button title="Change" onPress={() => setFlag((prev) => !prev)} />
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
          {flag ? text1 : text2}
        </MoreOrLess>
      </View>
      <View style={styles.container} />
    </SafeAreaView>
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
