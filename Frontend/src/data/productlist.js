// This file replaces the old products.js and exports the products list along with a helper
export const products = [
  { id: 1, name: "Gura Bhusi", bagSizes: [40] },
  { id: 2, name: "Bhusi", bagSizes: [37] },
  { id: 3, name: "Bhusi (Patta Bhusi)", bagSizes: [34] },
  { id: 4, name: "Kelai", bagSizes: [50] },
  { id: 5, name: "Masur Chanti", bagSizes: [40] },
  { id: 6, name: "Makai", bagSizes: [50] },
  { id: 7, name: "Gulli", bagSizes: [50] },
  { id: 8, name: "Matar Chunni", bagSizes: [40] },
  { id: 9, name: "Matar Chilka", bagSizes: [30] },
  { id: 10, name: "Sasso Khalli", bagSizes: [40, 45, 50] },
  { id: 11, name: "Khesari Chilka", bagSizes: [30] },
  { id: 12, name: "Khesari Chunni", bagSizes: [50] },
  { id: 13, name: "Fula", bagSizes: [40, 45] },
  { id: 14, name: "Mung Kuta", bagSizes: [50] },
  { id: 15, name: "Rasan", bagSizes: [50, 55, 60] },
  { id: 16, name: "Chana Chilka", bagSizes: [25, 30, 35] },
  { id: 17, name: "Chana Chunni", bagSizes: [50] },
  { id: 18, name: "Palish", bagSizes: [40, 45] },
  { id: 19, name: "Rogma", bagSizes: [30] },
  { id: 20, name: "Bhuja Chana", bagSizes: [30] },
  { id: 21, name: "Sawasi (Zhara)", bagSizes: [40, 45] }
];

// Simple helper function - returns object with name and weights array
export const getProductsGroupedByName = () => {
  const groups = {};
  products.forEach(product => {
    groups[product.name] = {
      name: product.name,
      weights: product.bagSizes
    };
  });
  return groups;
};
