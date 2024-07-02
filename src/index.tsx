import {
  View,
  requireNativeComponent,
  UIManager,
  Platform,
  processColor,
  type ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-mesh-gradient' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ComponentName = 'MeshGradientView';

const NativeMeshGradientView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<any>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };

export type MeshGradientProps = {
  style?: ViewStyle;
  /**
   * defaults to 2, > 0
   */
  speed?: number;
  /*
   * defaults to ['red', 'yellow', 'green', 'blue'], must be four colors
   */
  colors: string[];
  /**
   * defaults to 1, 0 - 2
   */
  brightness?: number;
  /**
   * defaults to 1, 0 - 2
   */
  contrast?: number;
  /**
   * defaults to 5, > 0
   */
  frequency?: number;
  /**
   * defaults to 30, > 0
   */
  amplitude?: number;
};

export const MeshGradient = ({
  style,
  speed = 2,
  // 0 - 2
  brightness = 1,
  // 0 - 2
  contrast = 1,
  colors = ['red', 'yellow', 'green', 'blue'],
  frequency = 5,
  amplitude = 30,
}: MeshGradientProps) => {
  return (
    <View style={style}>
      <NativeMeshGradientView
        style={{
          flex: 1,
        }}
        speed={speed}
        brightness={brightness}
        contrast={contrast}
        frequency={frequency}
        amplitude={amplitude}
        colors={colors.map((color) => processColor(color))}
      />
    </View>
  );
};
