import { colors, fonts } from "../config";
export const theme = {
  formInput: {
    // placeholderTextColor: colors.softGray,
    outlineColor: colors.fadedGray,
    activeOutlineColor: colors.yellow,
    textColor: colors.lightGray,
    style: {
      backgroundColor: colors.blueShade10,
      fontSize: 18,
    },
    contentStyle: { fontFamily: fonts.bold },
    selectionColor: colors.lightGray,
    cursorColor: colors.lightGray,
    mode: "outlined",
  },
  formInputColors: {
    placeholder: colors.softGray,
    text: colors.lightGray,
    primary: colors.yellow,
    onSurface: "red",
    outlineColor: colors.fadedGray,
    activeOutlineColor: colors.yellow,
  },
};
