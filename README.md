# react-native-mesh-gradient

MeshGradient for React Native.

https://github.com/KusStar/react-native-mesh-gradient/assets/21271495/35b84584-614e-4ffe-9801-1c6547b5eebc

You can download the example apk in [releases](https://github.com/KusStar/react-native-mesh-gradient/releases).

## Installation

Only supports Android for now.

```sh
# npm install @kuss/react-native-mesh-gradient
yarn add @kuss/react-native-mesh-gradient
```

## Usage

```js
import { MeshGradient } from "@kuss/react-native-mesh-gradient";

<MeshGradient
  colors={['red', 'yellow', 'green', 'blue']}
  style={{
    flex: 1,
    height: '100%',
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
  }}
/>
```

More at [example/App.tsx](./example/src/App.tsx)

## Interface

```ts
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
```

## Thanks

- The [shader](https://github.com/KusStar/react-native-mesh-gradient/blob/d676e2e3f560282835283117f052a78bdb1eb809/android/src/main/java/com/meshgradient/MeshGradientRenderer.kt#L17-L75) code is copied from [https://www.shadertoy.com/view/4t2SDh](https://www.shadertoy.com/view/4t2SDh) by [hahnzhu](https://www.shadertoy.com/user/hahnzhu).
- [Timeless's Api - Bing Random](https://apifox.com/apidoc/shared-faff130e-7aa3-42da-9f93-574b16c8acda/api-30781027), for getting the random bing wallpaper.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
