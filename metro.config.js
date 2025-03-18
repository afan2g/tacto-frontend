// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add SVG transformer configuration
const { resolver: { sourceExts, assetExts } } = config;

// Update the resolver to handle SVGs as components
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer")
};

config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter(ext => ext !== "svg"),
  sourceExts: [...sourceExts, "svg"],
  resolveRequest: (context, moduleName, platform) => {
    if (moduleName === "crypto") {
      // when importing crypto, resolve to react-native-quick-crypto
      return context.resolveRequest(
        context,
        "react-native-quick-crypto",
        platform
      );
    }
    // otherwise chain to the standard Metro resolver.
    return context.resolveRequest(context, moduleName, platform);
  }
};

module.exports = wrapWithReanimatedMetroConfig(config);