// FormContext.js
import React, { createContext, useContext, useState } from "react";
import routes from "../navigation/routes";

const FormContext = createContext();

// Map routes to progress steps
const PROGRESS_MAP = {
  [routes.SIGNUPUSERNAME]: 1,
  [routes.SIGNUPFULLNAME]: 2,
  [routes.SIGNUPIDENTIFIER]: 3,
  [routes.SIGNUPPASSWORD]: 4,
  [routes.SIGNUPVERIFY]: 5,
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    progress: 0,
    prevProgress: 0,
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const updateFormData = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const updateProgress = (routeName) => {
    const newProgress = PROGRESS_MAP[routeName] || 0;
    updateFormData({
      prevProgress: formData.progress,
      progress: newProgress,
    });
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, updateProgress }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => useContext(FormContext);
