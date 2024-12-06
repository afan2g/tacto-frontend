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
        style={styles.pickerStyle}
        containerStyle={styles.dropDownPickerContainerStyle}
        textStyle={styles.textStyle}
        labelStyle={styles.labelStyle}
        onChangeValue={onChangeItem}
        arrowIconStyle={styles.arrowIconStyle}
        tickIconStyle={styles.tickIconStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        selectedItemContainerStyle={styles.selectedItemContainerStyle}
        selectedItemLabelStyle={styles.selectedItemLabelStyle}
      />
      <ChevronsUpDown
        size={28}
        color={colors.lightGray}
        style={styles.sortByIcon}
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
  dropDownPickerContainerStyle: {
    maxWidth: "54%",
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
    fontFamily: fonts.regular,
    lineHeight: 20,
    color: colors.lightGray,
  },
  labelStyle: {
    fontFamily: fonts.black,
  },
  arrowIconStyle: {
    tintColor: colors.lightGray,
  },
  tickIconStyle: {
    tintColor: colors.lightGray,
  },
  dropDownContainerStyle: {
    backgroundColor: colors.blue,
    borderWidth: 1,
    borderColor: colors.fadedGray,
    borderRadius: 5,
  },
  sortByIcon: {
    marginLeft: 10,
  },
  selectedItemContainerStyle: {
    backgroundColor: colors.blueShade50,
  },
  selectedItemLabelStyle: {
    fontFamily: fonts.black,
  },
});
