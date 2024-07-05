import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import {Text} from 'react-native-elements';
import {Circle, Svg} from 'react-native-svg';
import Colors from '../../components/Constants/Color';
import {useTranslation} from 'react-i18next';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Loading() {
  const {t} = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1200,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  });

  return (
    <>
      <View style={styles.container}>
        <Text
          style={[
            styles.loadingText,
            {
              color: isDarkMode
                ? Colors.Dark.accentGreen
                : Colors.Light.accentGreen,
            },
          ]}>
          {t('loading')}
        </Text>
        <Svg>
          <Circle
            fill="none"
            cx={screenWidth / 2}
            cy={screenHeight / 2 - R}
            r={R}
            stroke={isDarkMode ? Colors.Dark.accent : Colors.Light.accent}
            strokeWidth={25}
          />
          <AnimatedCircle
            fill="none"
            cx={screenWidth / 2}
            cy={screenHeight / 2 - R}
            r={R}
            stroke={
              isDarkMode ? Colors.Dark.accentGreen : Colors.Light.accentGreen
            }
            strokeWidth={13}
            strokeDasharray={loadWidth}
            strokeDashoffset={animationValue}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View
        style={[
          isDarkMode
            ? {backgroundColor: Colors.Dark.appBackground}
            : {backgroundColor: Colors.Light.appBackground},
          {width: '100%', height: '100%', zIndex: 0},
        ]}></View>
    </>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const loadWidth = 600;
const R = loadWidth / (2 * Math.PI);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
    flex: 1,
    gap: 20,
    alignContent: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 32,
    position: 'absolute',
    top: screenHeight / 2 - R - 30,
    alignSelf: 'center',
    zIndex: 100,
    textTransform: 'capitalize',
  },
});
