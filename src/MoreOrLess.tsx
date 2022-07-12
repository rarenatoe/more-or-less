import React from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TextLayoutEventData,
  TextLayoutLine,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { usePrevious, useToggle } from './hooks';

type MoreOrLessProps = {
  children: string;
  containerStyle?: ViewStyle;
  numberOfLines: number;
  onMorePress?: () => void;
  moreText?: string;
  lessText?: string;
  textButtonStyle?: TextStyle;
  textComponent?: React.ComponentType<TextProps>;
  textStyle?: TextStyle;
} & Pick<TextProps, 'ellipsizeMode'>;

const MoreOrLess = ({
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
  const {
    value: isExpanded,
    setTrue: expandText,
    setFalse: shrinkText,
  } = useToggle(false);
  const [lines, setLines] = React.useState<TextLayoutLine[] | null>(null);
  const [hasMore, setHasMore] = React.useState(false);
  const previousNumberOfLines = usePrevious(numberOfLines);
  const previousLines = usePrevious(lines);
  const buttonStyleArray = [
    textStyle,
    styles.pressableDefault,
    textButtonStyle,
  ];

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
              <TextComponent style={buttonStyleArray} onPress={shrinkText}>
                {' '}
                {lessText}
              </TextComponent>
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
                  <TextComponent style={buttonStyleArray} onPress={onMorePress}>
                    {moreText}
                  </TextComponent>
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
  pressableDefault: TextStyle;
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
  pressableDefault: {
    color: '#36BDE8',
    fontWeight: 'bold',
  },
});

export default MoreOrLess;
