import { useState, useEffect, Fragment } from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  UIManager,
  Platform,
  StatusBar,
} from 'react-native';
import { MeshGradient } from 'react-native-mesh-gradient';
import { getColors } from 'react-native-image-colors';
import Slider, { type SliderProps } from '@react-native-community/slider';
import SystemNavigationBar from 'react-native-system-navigation-bar';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  SystemNavigationBar.setNavigationColor('translucent');
}

const imgs = [
  require('./assets/blond.jpg'),
  require('./assets/redbone.jpg'),
  require('./assets/brat.jpg'),
  require('./assets/jubilee.jpg'),
  require('./assets/nwjns.jpg'),
];

const DEFAULTS = {
  speed: 5,
  brightness: 0.8,
  contrast: 1.2,
  frequency: 5,
  amplitude: 30,
};

const MySlider = (props: SliderProps) => {
  return (
    <Slider
      style={styles.slider}
      minimumValue={0}
      maximumValue={100}
      minimumTrackTintColor={'#FFF'}
      thumbTintColor={'#FFF'}
      maximumTrackTintColor={'#FFF'}
      {...props}
    />
  );
};

const shuffle = (arr: any[]) => {
  const res = [...arr];
  let currentIndex = arr.length,
    temporaryValue,
    randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = res[currentIndex];
    res[currentIndex] = res[randomIndex];
    res[randomIndex] = temporaryValue;
  }
  return res;
};

export default function App() {
  const [showTools, setShowTools] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [colors, setColors] = useState<string[]>([]);
  const [brightness, setBrightness] = useState(DEFAULTS.brightness);
  const [contrast, setContrast] = useState(DEFAULTS.contrast);
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [amplitude, setAmplitude] = useState(DEFAULTS.amplitude);
  const [frequency, setFrequency] = useState(DEFAULTS.frequency);
  useEffect(() => {
    getColors(imgs[imgIndex])
      .then((data) => {
        if (data.platform === 'android') {
          setColors([data.dominant, data.average, data.vibrant, data.muted]);
        }
      })
      .catch(console.error);
  }, [imgIndex]);
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      {colors?.length === 4 && (
        <MeshGradient
          brightness={brightness}
          contrast={contrast}
          speed={speed}
          colors={colors}
          frequency={frequency}
          amplitude={amplitude}
          style={styles.meshGradient}
        />
      )}
      {showTools && (
        <View style={styles.toolsContainer}>
          <View style={styles.imgContainer}>
            <View style={styles.imgList}>
              {imgs?.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    LayoutAnimation.easeInEaseOut();
                    setImgIndex(index);
                  }}
                >
                  <Image
                    source={img}
                    style={[
                      styles.imgToPick,
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        borderWidth: index === imgIndex ? 2 : 0,
                        opacity: index === imgIndex ? 1 : 0.5,
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Image
              source={imgs[imgIndex]}
              style={styles.bigImg}
              onError={(e) => {
                console.log('error', e.nativeEvent);
              }}
            />
            <View style={styles.colorHints}>
              {colors?.map((color, index) => (
                <Fragment key={index}>
                  {index === 2 && (
                    <TouchableOpacity
                      onPress={() => {
                        setColors(shuffle(colors));
                      }}
                      style={styles.randomBtn}
                    >
                      <Text style={[styles.text, styles.random]}>🔀</Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.colorHintContainer}>
                    <Text style={[styles.text, styles.colorHintLabel]}>
                      {color}
                    </Text>
                    <View
                      style={[
                        styles.colorHint,
                        {
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                </Fragment>
              ))}
            </View>
          </View>
          <View style={styles.sliderSettings}>
            <View style={styles.sliderContainer}>
              <Text style={[styles.text, styles.sliderLabel]}>Speed</Text>
              <MySlider
                value={speed}
                minimumValue={0}
                maximumValue={100}
                onValueChange={setSpeed}
              />
              <Text style={[styles.text, styles.sliderValueText]}>
                {speed.toFixed(1)}
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={[styles.text, styles.sliderLabel]}>Brightness</Text>
              <MySlider
                value={brightness}
                minimumValue={0}
                maximumValue={2}
                onValueChange={setBrightness}
              />
              <Text style={[styles.text, styles.sliderValueText]}>
                {brightness.toFixed(1)}
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={[styles.text, styles.sliderLabel]}>Contrast</Text>
              <MySlider
                value={contrast}
                minimumValue={0}
                maximumValue={2}
                onValueChange={setContrast}
              />
              <Text style={[styles.text, styles.sliderValueText]}>
                {contrast.toFixed(1)}
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={[styles.text, styles.sliderLabel]}>Frequency</Text>
              <MySlider
                value={frequency}
                minimumValue={0}
                maximumValue={100}
                onValueChange={setFrequency}
              />
              <Text style={[styles.text, styles.sliderValueText]}>
                {frequency.toFixed(1)}
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              <Text style={[styles.text, styles.sliderLabel]}>Amplitude</Text>
              <MySlider
                value={amplitude}
                minimumValue={0}
                maximumValue={100}
                onValueChange={setAmplitude}
              />
              <Text style={[styles.text, styles.sliderValueText]}>
                {amplitude.toFixed(1)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSpeed(DEFAULTS.speed);
                setBrightness(DEFAULTS.brightness);
                setContrast(DEFAULTS.contrast);
                setFrequency(DEFAULTS.frequency);
                setAmplitude(DEFAULTS.amplitude);
              }}
            >
              <Text style={[styles.text, styles.reset]}>♻️</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.toogleToolBtn}
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          setShowTools(!showTools);
        }}
      >
        <Text style={[styles.text, styles.toggleToolText]}>
          {showTools ? '🙈' : '👀'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bigImg: {
    borderColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    height: 256,
    width: 256,
  },
  colorHint: {
    borderColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    height: 42,
    margin: 8,
    width: 42,
  },
  colorHintContainer: {
    alignItems: 'center',
  },
  colorHintLabel: {
    fontSize: 12,
  },
  colorHints: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  imgList: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imgToPick: {
    borderColor: '#fff',
    borderRadius: 8,
    height: 40,
    margin: 8,
    width: 40,
  },
  meshGradient: {
    flex: 1,
    height: '100%',
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
  },
  random: {
    fontSize: 24,
  },
  randomBtn: {
    margin: 8,
    marginTop: 24,
  },
  reset: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resetBtn: {
    marginTop: 16,
  },
  slider: {
    height: 40,
    width: 200,
  },
  sliderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  sliderLabel: {
    fontSize: 16,
    width: 80,
  },
  sliderSettings: {
    alignItems: 'center',
    marginTop: 16,
  },
  sliderValueText: {
    fontSize: 16,
    textAlign: 'center',
    width: 40,
  },
  text: {
    color: '#fff',
  },
  toggleToolText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  toogleToolBtn: {
    bottom: 24,
    position: 'absolute',
  },
  toolsContainer: {
    marginTop: -64,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
