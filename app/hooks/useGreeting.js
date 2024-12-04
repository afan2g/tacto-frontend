import React, { useEffect, useState } from "react";

/* 
needs to include an API call to get the user's first name
*/
export default useGreeting = () => {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return greeting; //should be: return { greeting, firstName }
};
