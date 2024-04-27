import React, { ComponentType, useCallback, useEffect, useMemo } from 'react';
import {
  LayoutAnimation,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TextLayoutLine,
  TextProps,
  TextStyle,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';
import ClippedShrunkText from './ClippedShrunkText';
import { usePrevious, useToggle } from './hooks';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type MoreOrLessProps = {
  children: string;
  containerStyle?: ViewStyle;
  numberOfLines: number;
  onMorePress?: () => void;
  moreText?: string;
  lessText?: string;
  textButtonStyle?: TextStyle;
  textComponent?: ComponentType<TextProps>;
  textStyle?: TextStyle;
  animated?: boolean;
} & Pick<TextProps, 'ellipsizeMode'>;

const MoreOrLess = ({
  animated = false,
  children,
  containerStyle,
  numberOfLines,
  onMorePress: customOnMorePress,
  moreText = 'more',
  lessText = 'less',
  textButtonStyle,
  textComponent: TextComponent = Text,
  textStyle,
}: MoreOrLessProps) => {
  const { value: isExpanded, setTrue: expandText, setFalse: shrinkText } = useToggle(false);
  const [lines, setLines] = React.useState<TextLayoutLine[] | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const previousChildren = usePrevious(children);
  const previousNumberOfLines = usePrevious(numberOfLines);
  const previousLines = usePrevious(lines);
  const buttonStyleArray = [textStyle, styles.bold, textButtonStyle];

  useEffect(() => {
    if (lines !== null && numberOfLines !== previousNumberOfLines) setLines(null);
  }, [lines, numberOfLines, previousNumberOfLines]);

  useEffect(() => {
    if (animated)
      LayoutAnimation.configureNext({
        duration: 600,
        create: { type: 'linear', property: 'opacity' },
        update: { type: 'spring', springDamping: 2 },
        delete: { type: 'linear', property: 'opacity' },
      });
  }, [animated, isExpanded]);

  const onTextLayoutGetLines = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      const _lines = [...event.nativeEvent.lines];

      if (_lines.length > numberOfLines) {
        // Determine if showMore is shown or not and
        if (_lines[numberOfLines].text) setHasMore(true);
        // restore the array to be its original numberOfLines.
        while (_lines.length > numberOfLines) {
          const extraLine = _lines.pop()?.text ?? '';
          _lines[numberOfLines - 1].text += extraLine;
        }
      }

      setLines(_lines);
    },
    [numberOfLines]
  );

  const onMorePress = useMemo(
    () => (hasMore ? customOnMorePress ?? expandText : null),
    [customOnMorePress, expandText, hasMore]
  );

  if (!children) return null;

  // Is rendered for the first time or children changed.
  if (lines === null || previousChildren !== children)
    return (
      <View style={containerStyle}>
        <View>
          <TextComponent
            style={[textStyle, styles.hiddenTextAbsolute]}
            // "+ 1" because we want to see if
            // the lines include another one
            // or just fit all in 3 lines.
            numberOfLines={numberOfLines + 1}
            onTextLayout={onTextLayoutGetLines}
          >
            {children}
          </TextComponent>
        </View>
      </View>
    );

  const linesToRender = lines ?? previousLines;

  if (linesToRender)
    return (
      <View style={containerStyle}>
        {isExpanded && !customOnMorePress ? (
          <TextComponent style={textStyle}>
            <TextComponent style={textStyle}>{children}</TextComponent>
            <TextComponent style={buttonStyleArray} onPress={shrinkText}>
              {' '}
              {lessText}
            </TextComponent>
          </TextComponent>
        ) : (
          <View>
            <ClippedShrunkText
              linesToRender={linesToRender}
              numberOfLines={numberOfLines}
              textComponent={TextComponent}
              textStyle={textStyle}
            >
              {children}
            </ClippedShrunkText>
            <View style={styles.lastLine}>
              <View style={styles.ellipsedText}>
                <TextComponent style={textStyle} numberOfLines={1}>
                  {linesToRender[linesToRender.length - 1].text}
                </TextComponent>
              </View>
              {onMorePress && (
                <TextComponent style={buttonStyleArray} onPress={onMorePress}>
                  {moreText}
                </TextComponent>
              )}
            </View>
          </View>
        )}
      </View>
    );

  return null;
};

type MoreOrLessStyles = {
  ellipsedText: TextStyle;
  hiddenTextAbsolute: TextStyle;
  lastLine: TextStyle;
  bold: TextStyle;
};

const styles = StyleSheet.create<MoreOrLessStyles>({
  bold: {
    fontWeight: 'bold',
  },
  ellipsedText: {
    flex: 1,
  },
  hiddenTextAbsolute: {
    left: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  lastLine: {
    flexDirection: 'row',
  },
});

export default MoreOrLess;
