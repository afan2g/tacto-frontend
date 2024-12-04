import React from "react";
import { useFormikContext } from "formik";
import AppButton from "./AppButton";

export default function SubmitButton({ name, color }) {
  const { handleSubmit } = useFormikContext();
  return <AppButton onPress={handleSubmit} title={name} color={color} />;
}
