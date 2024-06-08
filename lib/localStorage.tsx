"use client";
export const setItemInStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting item in localStorage:", error);
  }
};

export const getItemFromStorage = (key: string) => {
  console.log(key);
  try {
    const item = localStorage.getItem(key);
    console.log(item);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};
