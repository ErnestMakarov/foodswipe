import type { Food, FoodPreferences } from "../../types/food";

export function filterFoods(
  allFoods: Food[],
  preferences: FoodPreferences,
): Food[] {
  return allFoods.filter((food) => {
    const withinBudget = food.price <= preferences.budget;
    const categoryAllowed = !preferences.excludedCategories.includes(food.category);
    const vegetarianAllowed =
      !preferences.vegetarianOnly || food.tags.includes("Vegetarian") || food.tags.includes("Vegan");

    return withinBudget && categoryAllowed && vegetarianAllowed;
  });
}

/** Deterministic shuffle so the prototype doesn't show categories in the same order each time. */
export function shuffleFoods(items: Food[]): Food[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}