export type FoodCategory =
  | "Burgers"
  | "Asian"
  | "Italian"
  | "Healthy"
  | "Pizza"
  | "Desserts";

export type Food = {
  id: string;
  name: string;
  restaurant: string;
  description: string;
  price: number;
  category: FoodCategory;
  tags: string[];
  image: string;
  imageAlt: string;
  rating: number;
  deliveryMinutes: string;
};

export type FoodPreferences = {
  budget: number;
  excludedCategories: FoodCategory[];
  vegetarianOnly: boolean;
};

export type FoodDecision = {
  foodId: string;
  liked: boolean;
};