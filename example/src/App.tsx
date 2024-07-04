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
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MeshGradient } from '@kuss/react-native-mesh-gradient';
import { getColors } from 'react-native-image-colors';
import Slider, { type SliderProps } from '@react-native-community/slider';
import SystemNavigationBar from 'react-native-system-navigation-bar';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  SystemNavigationBar.setNavigationColor('transparent');
}

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

const useDimensions = () => {
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [height, setHeight] = useState(Dimensions.get('window').height);
  useEffect(() => {
    const onLayout = ({
      nativeEvent: {
        layout: { width, height },
      },
    }: any) => {
      setWidth(width);
      setHeight(height);
    };
    const listener = Dimensions.addEventListener('change', onLayout);
    return () => {
      listener.remove();
    };
  }, []);
  return { width, height };
};

export default function App() {
  const { height, width } = useDimensions();
  const isLandscape = width > height;
  const [showTools, setShowTools] = useState(true);
  const [colors, setColors] = useState<string[]>([]);
  const [brightness, setBrightness] = useState(DEFAULTS.brightness);
  const [contrast, setContrast] = useState(DEFAULTS.contrast);
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [amplitude, setAmplitude] = useState(DEFAULTS.amplitude);
  const [frequency, setFrequency] = useState(DEFAULTS.frequency);
  const [imgSource, setImgSource] = useState<string>();
  const loadImgSource = async () => {
    setImgSource(undefined);
    const res = await fetch(
      `https://api.timelessq.com/bing/random?format=json`
    );
    const data = await res.json();
    const imgUrl = data.data.url;
    const colorsData = await getColors(imgUrl);
    setImgSource(imgUrl);
    if (colorsData.platform === 'android') {
      console.log('colorsData', colorsData);
      let lightColors = Object.entries(colorsData)
        .filter(([key]) => key.includes('light_'))
        .map(([_, value]) => value);
      if (lightColors.length < 4) {
        lightColors = lightColors.concat([
          colorsData.average,
          colorsData.dominant,
          colorsData.vibrant,
          colorsData.muted,
        ]);
      }
      lightColors = lightColors.slice(0, 4);
      console.log('lightColors', lightColors);
      setColors(lightColors);
    }
  };
  useEffect(() => {
    loadImgSource();
  }, []);
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
        <View
          style={[
            styles.toolsContainer,
            isLandscape && {
              flexDirection: 'row',
            },
          ]}
        >
          <View style={styles.imgContainer}>
            <View style={styles.refresh}>
              {imgSource ? (
                <TouchableOpacity
                  onPress={() => {
                    loadImgSource();
                  }}
                >
                  <Text style={{ fontSize: 24 }}>🔀</Text>
                </TouchableOpacity>
              ) : (
                <ActivityIndicator color={'#fff'} size={24} />
              )}
            </View>
            <View
              style={[
                styles.bigImg,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              {imgSource ? (
                <Image
                  source={{ uri: imgSource }}
                  style={styles.bigImg}
                  onError={(e) => {
                    console.log('error', e.nativeEvent);
                  }}
                />
              ) : (
                <ActivityIndicator color={'#fff'} size={64} />
              )}
            </View>
            <View style={styles.colorHints}>
              {colors?.map((color, index) => (
                <Fragment key={index}>
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
          <View style={styles.spacing} />
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
  refresh: {
    height: 32,
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
  spacing: {
    margin: 16,
  },
});
