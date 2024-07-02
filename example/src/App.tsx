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
      {showTools && (
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              marginTop: 16,
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
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      borderWidth: index === imgIndex ? 2 : 0,
                      borderColor: '#fff',
                      margin: 8,
                      opacity: index === imgIndex ? 1 : 0.5,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Image
              source={imgs[imgIndex]}
              style={{
                width: 256,
                height: 256,
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
                justifyContent: 'center',
              }}
            >
              {colors?.map((color, index) => (
                <Fragment key={index}>
                  {index === 2 && (
                    <TouchableOpacity
                      onPress={() => {
                        setColors(shuffle(colors));
                      }}
                      style={{
                        margin: 8,
                      }}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            fontSize: 24,
                          },
                        ]}
                      >
                        🔀
                      </Text>
                    </TouchableOpacity>
                  )}
                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={[
                        styles.text,
                        {
                          fontSize: 12,
                        },
                      ]}
                    >
                      {color}
                    </Text>
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        backgroundColor: color,
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: '#fff',
                        margin: 8,
                      }}
                    />
                  </View>
                </Fragment>
              ))}
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text, { width: 70 }]}>Speed</Text>
              <MySlider
                value={speed}
                minimumValue={0}
                maximumValue={100}
                onValueChange={setSpeed}
              />
              <Text style={[styles.text, { width: 32, textAlign: 'center' }]}>
                {speed.toFixed(1)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text, { width: 70 }]}>Brightness</Text>
              <MySlider
                value={brightness}
                minimumValue={0}
                maximumValue={2}
                onValueChange={setBrightness}
              />
              <Text style={[styles.text, { width: 32, textAlign: 'center' }]}>
                {brightness.toFixed(1)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text, { width: 70 }]}>Contrast</Text>
              <MySlider
                style={{ width: 200, height: 40 }}
                value={contrast}
                minimumValue={0}
                maximumValue={2}
                onValueChange={setContrast}
              />
              <Text style={[styles.text, { width: 32, textAlign: 'center' }]}>
                {contrast.toFixed(1)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text, { width: 70 }]}>Frequency</Text>
              <MySlider
                value={frequency}
                minimumValue={0}
                maximumValue={100}
                onValueChange={setFrequency}
              />
              <Text style={[styles.text, { width: 32, textAlign: 'center' }]}>
                {frequency.toFixed(1)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.text, { width: 70 }]}>Amplitude</Text>
              <MySlider
                value={amplitude}
                minimumValue={0}
                maximumValue={100}
                onValueChange={setAmplitude}
              />
              <Text style={[styles.text, { width: 32, textAlign: 'center' }]}>
                {amplitude.toFixed(1)}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 16,
              }}
              onPress={() => {
                setSpeed(DEFAULTS.speed);
                setBrightness(DEFAULTS.brightness);
                setContrast(DEFAULTS.contrast);
                setFrequency(DEFAULTS.frequency);
                setAmplitude(DEFAULTS.amplitude);
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 24,
                    fontWeight: 'bold',
                  },
                ]}
              >
                ♻️
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={{ position: 'absolute', bottom: 32 }}
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          setShowTools(!showTools);
        }}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: 32,
              fontWeight: 'bold',
            },
          ]}
        >
          {showTools ? '🙈' : '👀'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
