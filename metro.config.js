// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.resolveRequest = (context, moduleName, platform) => {
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
};
module.exports = wrapWithReanimatedMetroConfig(config);
