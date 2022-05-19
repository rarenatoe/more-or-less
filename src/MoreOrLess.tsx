import React from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextLayoutEventData,
  TextLayoutLine,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { usePrevious, useToggle } from './hooks';
import DefaultText from './DefaultText';

export type TextWrapperProps = Omit<TextProps, 'children'> & {
  textComponent?: React.ComponentType<TextProps>;
  children: string;
};

type MoreOrLessProps = {
  numberOfLines: number;
  onMorePress?: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
} & Omit<TextWrapperProps, 'style'>;

const MoreOrLess = ({
  children,
  numberOfLines,
  onMorePress: customOnMorePress,
  textComponent: TextComponent = DefaultText,
  containerStyle,
  textStyle,
}: MoreOrLessProps) => {
  const {
    value: isExpanded,
    setTrue: expandText,
    setFalse: shrinkText,
  } = useToggle(false);
  const [lines, setLines] = React.useState<TextLayoutLine[] | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const previousNumberOfLines = usePrevious(numberOfLines);
  const previousLines = usePrevious(lines);

  React.useEffect(() => {
    if (lines !== null && numberOfLines !== previousNumberOfLines)
      setLines(null);
  }, [lines, numberOfLines, previousNumberOfLines]);

  const onTextLayoutGetLines = React.useCallback(
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

  const onMorePress = React.useMemo(
    () => (hasMore ? customOnMorePress ?? expandText : null),
    [customOnMorePress, expandText, hasMore]
  );

  if (!children) return null;

  if (lines === null)
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
        <View>
          {isExpanded && !customOnMorePress ? (
            <TextComponent style={textStyle}>
              <TextComponent>{children}</TextComponent>
              {/* The whitespace before less is NOT a bug, quite the opposite */}
              <TextComponent onPress={shrinkText}> less</TextComponent>
            </TextComponent>
          ) : (
            <View>
              {linesToRender.length > 1 && (
                // Render the first N-1 lines at full width
                <TextComponent
                  style={textStyle}
                  numberOfLines={
                    Math.min(numberOfLines, linesToRender.length) - 1
                  }
                  ellipsizeMode="clip"
                >
                  {Platform.OS === 'ios'
                    ? linesToRender
                        .slice(0, linesToRender.length - 1)
                        .map((line) => line.text)
                    : children}
                </TextComponent>
              )}
              <View style={styles.lastLine}>
                <View style={styles.ellipsedText}>
                  <TextComponent style={textStyle} numberOfLines={1}>
                    {linesToRender[linesToRender.length - 1].text}
                  </TextComponent>
                </View>
                {onMorePress && (
                  <TextComponent onPress={onMorePress}>more</TextComponent>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    );

  return null;
};

type MoreOrLessStyles = {
  ellipsedText: TextStyle;
  hiddenTextAbsolute: TextStyle;
  lastLine: TextStyle;
};

export const styles = StyleSheet.create<MoreOrLessStyles>({
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
