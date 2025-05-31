// src/utils/viewedProducts.js

export const getViewedProducts = () => {
  return JSON.parse(localStorage.getItem("viewedProducts")) || [];
};

export const markProductAsViewed = (id) => {
  const viewed = getViewedProducts();
  if (!viewed.includes(id)) {
    viewed.push(id);
    localStorage.setItem("viewedProducts", JSON.stringify(viewed));
  }
};
