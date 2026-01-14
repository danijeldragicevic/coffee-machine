import { RECIPES } from '../../src/data/recipees.js';

describe('Coffee Recipes', () => {
  test('RECIPES contains all three drinks', () => {
    expect(Object.keys(RECIPES)).toEqual(['espresso', 'latte', 'cappuccino']);
  });

  test('espresso recipe has correct attributes', () => {
    expect(RECIPES.espresso).toEqual({
      water: 250,
      milk: 0,
      beans: 16,
      cups: 1,
      money: 4
    });
  });

  test('latte recipe has correct attributes', () => {
    expect(RECIPES.latte).toEqual({
      water: 350,
      milk: 75,
      beans: 20,
      cups: 1,
      money: 7
    });
  });

  test('cappuccino recipe has correct attributes', () => {
    expect(RECIPES.cappuccino).toEqual({
      water: 200,
      milk: 100,
      beans: 12,
      cups: 1,
      money: 6
    });
  });

  test('all recipes have required properties', () => {
    const requiredProperties = ['water', 'milk', 'beans', 'cups', 'money'];

    Object.entries(RECIPES).forEach(([drinkName, recipe]) => {
      requiredProperties.forEach(prop => {
        expect(recipe).toHaveProperty(prop);
        expect(typeof recipe[prop]).toBe('number');
      });
    });
  });
});

