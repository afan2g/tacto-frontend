import { useState, useEffect } from "react";
import { Vibration } from "react-native";
import * as Haptics from "expo-haptics";
export const useKeypadInput = (
  initialValue = "",
  options = {
    maxDecimalPlaces: 2,
    allowLeadingZero: false,
    maxValue: 999999.99,
  }
) => {
  const [value, setValue] = useState(initialValue);

  const handleKeyPress = (key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    // Vibration.vibrate(1);
    const decimalRegex = new RegExp(
      `^(\\d+\\.?\\d{0,${options.maxDecimalPlaces}}|\\.\\d{0,${options.maxDecimalPlaces}})$`
    );
    const currentValue = value || "";

    switch (key) {
      case "<":
        if (currentValue === "") return;
        setValue((prevValue) => {
          const updatedValue = prevValue.slice(0, -1);
          return updatedValue;
        });
        break;
      case "0":
        if (currentValue === "0" && !options.allowLeadingZero) return;

        if (decimalRegex.test(currentValue + "0")) {
          const newValue = currentValue + "0";
          const numericValue = parseFloat(newValue);
          if (numericValue <= options.maxValue) {
            setValue(newValue);
          }
        }
        break;
      case ".":
        if (currentValue === "") {
          setValue("0.");
          return;
        }
        // Prevent multiple decimals
        if (!currentValue.includes(".")) {
          setValue(currentValue + key);
        }
        break;
      default:
        if (/^\d$/.test(key)) {
          if (currentValue === "" || currentValue === "0") {
            setValue(key);
            return;
          }

          // New regex to strictly enforce decimal precision
          const newValue = currentValue + key;
          if (decimalRegex.test(newValue)) {
            const numericValue = parseFloat(newValue);
            if (numericValue <= options.maxValue && numericValue >= 0) {
              setValue(newValue);
            }
          }
        }
    }
  };

  const resetValue = () => setValue("");

  return {
    value,
    setValue,
    handleKeyPress,
    resetValue,
  };
};
