import { useState } from "react";
import RNHapticFeedback from "react-native-haptic-feedback";
import { Text, Platform, Vibration } from "react-native";

export const useKeypadInput = (
  initialValue = "",
  options = {
    maxDecimalPlaces: 2,
    allowLeadingZero: false,
    maxValue: 999999.99,
  }
) => {
  const [value, setValue] = useState(initialValue);
  const [hasDecimal, setHasDecimal] = useState(false);
  const [valid, setValid] = useState(true);

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

  const getDisplayAmount = (placeholderStyle) => {
    if (value === "") {
      return <Text style={placeholderStyle}>$0</Text>;
    }

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    // Check if the input has a decimal point
    const hasDecimal = value.includes('.');

    // For partial decimal input, we need special handling
    if (hasDecimal) {
      const parts = value.split('.');
      const wholeNumber = parts[0];
      const decimals = parts.length > 1 ? parts[1] : '';

      // If we have incomplete decimals or just a decimal point, show placeholders
      if (decimals.length < options.maxDecimalPlaces || decimals.length === 0) {
        // Format just the whole number part without any decimals
        const wholeFormatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(parseFloat(wholeNumber || '0'));

        // If there are some decimals, format them normally
        const decimalPart = decimals.length > 0
          ? '.' + decimals
          : '.'; // Just the decimal point if no digits after it

        // Calculate how many placeholder zeros we need
        const neededZeros = options.maxDecimalPlaces - decimals.length;
        const placeholderZeros = neededZeros > 0 ? '0'.repeat(neededZeros) : '';

        return (
          <>
            {wholeFormatted}{decimalPart}
            <Text style={placeholderStyle}>{placeholderZeros}</Text>
          </>
        );
      }
    }

    // For complete values with no placeholder needed, just use standard formatting
    return formatter.format(parseFloat(value));
  };

  return {
    value,
    setValue,
    handleKeyPress,
    resetValue,
    hasDecimal,
    valid,
    getDisplayAmount,
  };
};