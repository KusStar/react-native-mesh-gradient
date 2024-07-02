import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { MeshGradientView } from 'react-native-mesh-gradient';
import { getColors } from 'react-native-image-colors';

export default function App() {
  React.useEffect(() => {
    const url = 'https://i.imgur.com/68jyjZT.jpg';

    getColors(url, {
      fallback: '#228B22',
      cache: true,
      key: url,
    }).then((data) => {
      console.log('getColors', data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <MeshGradientView
        brightness={0.7}
        contrast={1.3}
        speed={5}
        colors={['#769CDF', '#8991A2', '#A288A6', '#FF5449']}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          position: 'absolute',
        }}
      />
      <Text>Hello Mesh Gradient</Text>
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
