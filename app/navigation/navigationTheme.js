import { DefaultTheme } from "@react-navigation/native";
import colors from "../config/colors";

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.yellow,
    background: colors.blue,
    card: colors.blue,
    border: colors.fadedGray,
    text: colors.lightGray,
  },
};
