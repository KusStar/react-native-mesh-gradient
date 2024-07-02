import { useState, useEffect } from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { MeshGradient } from 'react-native-mesh-gradient';
import { getColors } from 'react-native-image-colors';
import Slider, { type SliderProps } from '@react-native-community/slider';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
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
      style={{ width: 200, height: 40 }}
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
          LayoutAnimation.easeInEaseOut();
          setColors([data.dominant, data.average, data.vibrant, data.muted]);
          console.log('data', data);
        }
      })
      .catch(console.error);
  }, [imgIndex]);
  return (
    <View style={styles.container}>
      {colors?.length === 4 && (
        <MeshGradient
          brightness={brightness}
          contrast={contrast}
          speed={speed}
          colors={colors}
          frequency={frequency}
          amplitude={amplitude}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            position: 'absolute',
          }}
        />
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 70 }}>Speed</Text>
            <MySlider
              value={speed}
              minimumValue={0}
              maximumValue={100}
              onValueChange={setSpeed}
            />
            <Text style={{ width: 32, textAlign: 'center' }}>
              {speed.toFixed(1)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 70 }}>Brightness</Text>
            <MySlider
              value={brightness}
              minimumValue={0}
              maximumValue={2}
              onValueChange={setBrightness}
            />
            <Text style={{ width: 32, textAlign: 'center' }}>
              {brightness.toFixed(1)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 70 }}>Contrast</Text>
            <MySlider
              style={{ width: 200, height: 40 }}
              value={contrast}
              minimumValue={0}
              maximumValue={2}
              onValueChange={setContrast}
            />
            <Text style={{ width: 32, textAlign: 'center' }}>
              {contrast.toFixed(1)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 70 }}>Frequency</Text>
            <MySlider
              value={frequency}
              minimumValue={0}
              maximumValue={100}
              onValueChange={setFrequency}
            />
            <Text style={{ width: 32, textAlign: 'center' }}>
              {frequency.toFixed(1)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ width: 70 }}>Amplitude</Text>
            <MySlider
              value={amplitude}
              minimumValue={0}
              maximumValue={100}
              onValueChange={setAmplitude}
            />
            <Text style={{ width: 32, textAlign: 'center' }}>
              {amplitude.toFixed(1)}
            </Text>
          </View>
          <TouchableOpacity
            style={{ marginTop: 16 }}
            onPress={() => {
              setSpeed(DEFAULTS.speed);
              setBrightness(DEFAULTS.brightness);
              setContrast(DEFAULTS.contrast);
              setFrequency(DEFAULTS.frequency);
              setAmplitude(DEFAULTS.amplitude);
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
              >
                Reset
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginLeft: 64,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
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
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: '#fff',
                    margin: 8,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Image
            source={imgs[imgIndex]}
            style={{
              width: 300,
              height: 300,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#fff',
            }}
            onError={(e) => {
              console.log('error', e.nativeEvent);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: 16,
              alignItems: 'center',
            }}
          >
            {colors?.map((color, index) => (
              <View
                key={color + index}
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: color,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: '#fff',
                  margin: 8,
                }}
              />
            ))}
          </View>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.easeInEaseOut();
              setColors(shuffle(colors));
            }}
            style={{
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 24,
              }}
            >
              🔀
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
