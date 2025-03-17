import { useState, useEffect } from "react";
import RNHapticFeedback from "react-native-haptic-feedback";
import { Platform, Vibration } from "react-native";
import { useAmountFormatter } from "./useAmountFormatter";
export const useKeypadInput = (
  initialValue = "",
  options = {
    maxDecimalPlaces: 2,
    allowLeadingZero: false,
    maxValue: 999999.99,
  }
) => {
  const [value, setValue] = useState(initialValue);
  const [hasDecimal, setHasDecimal] = useState(initialValue ? initialValue.includes(".") : false);
  const [valid, setValid] = useState(true);

  // Initialize the amount formatter with the same decimal place configuration
  const { getDisplayAmount } = useAmountFormatter({
    maxDecimalPlaces: options.maxDecimalPlaces
  });

  // Update hasDecimal whenever value changes from external sources
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setHasDecimal(String(value).includes('.'));
    }
  }, [value]);

  const triggerHapticFeedback = (isValid) => {
    if (isValid) {
      RNHapticFeedback.trigger(Platform.OS === 'android' ? "effectHeavyClick" : "soft", {
        ignoreAndroidSystemSettings: true,
      });
    } else {
      Vibration.vibrate(150);
    }
  };

  const handleKeyPress = (key) => {
    let isValid = true;
    const decimalRegex = new RegExp(
      `^(\\d+\\.?\\d{0,${options.maxDecimalPlaces}}|\\.\\d{0,${options.maxDecimalPlaces}})$`
    );
    const currentValue = value || "";

    switch (key) {
      case "<":
        if (currentValue === "") {
          isValid = false;
        } else if (parseFloat(currentValue) === 0) {
          setValue("");
          setHasDecimal(false);
        } else {
          setValue((prevValue) => {
            const updatedValue = prevValue.slice(0, -1);
            // If we're removing the decimal point, update hasDecimal
            if (prevValue.slice(-1) === ".") {
              setHasDecimal(false);
            }
            return updatedValue;
          });
        }
        break;

      case "0":
        if (currentValue === "0" && !options.allowLeadingZero) {
          isValid = false;
        } else {
          const newValue = currentValue + "0";
          if (decimalRegex.test(newValue)) {
            const numericValue = parseFloat(newValue);
            if (numericValue <= options.maxValue) {
              setValue(newValue);
            } else {
              isValid = false;
            }
          } else {
            isValid = false;
          }
        }
        break;

      case ".":
        if (currentValue === "") {
          setValue("0.");
          setHasDecimal(true);
        } else if (!currentValue.includes(".")) {
          setValue(currentValue + key);
          setHasDecimal(true);
        } else {
          isValid = false;
        }
        break;

      default:
        if (/^\d$/.test(key)) {
          if (currentValue === "" || currentValue === "0") {
            setValue(key);
            break;
          }

          const newValue = currentValue + key;
          if (decimalRegex.test(newValue)) {
            const numericValue = parseFloat(newValue);
            if (numericValue <= options.maxValue && numericValue >= 0) {
              setValue(newValue);
            } else {
              isValid = false;
            }
          } else {
            isValid = false;
          }
        } else {
          isValid = false;
        }
    }

    // Update valid state and trigger haptic feedback with the calculated validity
    setValid(isValid);
    triggerHapticFeedback(isValid);
  };

  const resetValue = () => {
    setValue("");
    setHasDecimal(false);
    setValid(true);
  };



  return {
    value,
    setValue,
    handleKeyPress,
    resetValue,
    getDisplayAmount,
    hasDecimal,
    valid
  };
};