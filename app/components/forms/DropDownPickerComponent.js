import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { colors, fonts } from "../../config";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react-native";

export default function DropDownPickerComponent({
  items,
  defaultValue,
  onChangeItem,
  onPressIcon,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || items[0]?.value); // Set default to first item's value
  const [itemsList, setItemsList] = useState(items);

  useEffect(() => {
    setValue(defaultValue || items[0]?.value); // Update when defaultValue changes
  }, [defaultValue, items]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={itemsList}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItemsList}
        containerStyle={styles.containerStyle}
        style={styles.pickerStyle}
        textStyle={styles.textStyle}
        onChangeValue={onChangeItem}
        arrowIconStyle={styles.arrowIconStyle}
        listItemContainerStyle={styles.listItemContainerStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
      />
      <ChevronsUpDown
        size={24}
        color={colors.lightGray}
        style={styles.icon}
        onPress={onPressIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  containerStyle: {
    paddingVertical: 10,
    maxWidth: "50%",
    borderWidth: 0,
    marginLeft: 10,
  },
  pickerStyle: {
    backgroundColor: "transparent",
    borderColor: colors.fadedGray,
    borderRadius: 5,
    minHeight: 32,
    paddingVertical: 5,
  },
  textStyle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    lineHeight: 20,
    color: colors.lightGray,
  },
  arrowIconStyle: {
    tintColor: colors.lightGray,
  },
  dropDownContainerStyle: {
    backgroundColor: colors.blue,
    borderWidth: 1,
    borderColor: colors.fadedGray,
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10,
  },
});
