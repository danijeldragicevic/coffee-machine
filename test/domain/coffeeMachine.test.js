import { CoffeeMachine } from '../../src/domain/coffeeMachine.js';
import { RECIPES } from '../../src/data/recipees.js';
import { DEFAULT_SUPPLIES } from '../../src/data/supplies.js';

describe('CoffeeMachine', () => {
  let machine;

  beforeEach(() => {
    machine = new CoffeeMachine();
  });

  describe('Constructor', () => {
    test('should initialize with default recipes and supplies', () => {
      expect(machine.recipes).toEqual(RECIPES);
      expect(machine.supplies).toEqual(DEFAULT_SUPPLIES);
    });

    test('should accept custom recipes', () => {
      const customRecipes = {
        customDrink: { water: 100, milk: 50, beans: 10, cups: 1, money: 5 }
      };
      const customMachine = new CoffeeMachine({ recipes: customRecipes });

      expect(customMachine.recipes).toEqual(customRecipes);
    });

    test('should accept custom supplies', () => {
      const customSupplies = { water: 2000, milk: 2000, beans: 2000, cups: 200, money: 0 };
      const customMachine = new CoffeeMachine({ supplies: customSupplies });

      expect(customMachine.supplies.water).toBe(2000);
      expect(customMachine.supplies.milk).toBe(2000);
      expect(customMachine.supplies.beans).toBe(2000);
      expect(customMachine.supplies.cups).toBe(200);
    });

    test('should merge custom supplies with defaults', () => {
      const customSupplies = { water: 2000 };
      const customMachine = new CoffeeMachine({ supplies: customSupplies });

      expect(customMachine.supplies.water).toBe(2000);
      expect(customMachine.supplies.milk).toBe(DEFAULT_SUPPLIES.milk);
      expect(customMachine.supplies.beans).toBe(DEFAULT_SUPPLIES.beans);
      expect(customMachine.supplies.cups).toBe(DEFAULT_SUPPLIES.cups);
      expect(customMachine.supplies.money).toBe(DEFAULT_SUPPLIES.money);
    });

    test('should create independent instances', () => {
      const machine1 = new CoffeeMachine();
      const machine2 = new CoffeeMachine();

      machine1.brew('espresso');

      // machine2 should not be affected
      expect(machine2.supplies).toEqual(DEFAULT_SUPPLIES);
    });
  });

  describe('canBrew', () => {
    test('should return true when enough supplies are available', () => {
      const recipe = { water: 100, milk: 50, beans: 10, cups: 1 };

      expect(machine.canBrew(recipe)).toBe(true);
    });

    test('should return false when not enough water', () => {
      const recipe = { water: 10000, milk: 50, beans: 10, cups: 1 };

      expect(machine.canBrew(recipe)).toBe(false);
    });

    test('should return false when not enough milk', () => {
      const recipe = { water: 100, milk: 10000, beans: 10, cups: 1 };

      expect(machine.canBrew(recipe)).toBe(false);
    });

    test('should return false when not enough beans', () => {
      const recipe = { water: 100, milk: 50, beans: 10000, cups: 1 };

      expect(machine.canBrew(recipe)).toBe(false);
    });

    test('should return false when not enough cups', () => {
      const recipe = { water: 100, milk: 50, beans: 10, cups: 200 };

      expect(machine.canBrew(recipe)).toBe(false);
    });
  });

  describe('brew', () => {
    test('should successfully brew espresso', () => {
      const result = machine.brew('espresso');

      expect(result.success).toBe(true);
      expect(machine.supplies.water).toBe(DEFAULT_SUPPLIES.water - RECIPES.espresso.water);
      expect(machine.supplies.milk).toBe(DEFAULT_SUPPLIES.milk - RECIPES.espresso.milk);
      expect(machine.supplies.beans).toBe(DEFAULT_SUPPLIES.beans - RECIPES.espresso.beans);
      expect(machine.supplies.cups).toBe(DEFAULT_SUPPLIES.cups - RECIPES.espresso.cups);
      expect(machine.supplies.money).toBe(DEFAULT_SUPPLIES.money + RECIPES.espresso.money);
    });

    test('should successfully brew latte', () => {
      const result = machine.brew('latte');

      expect(result.success).toBe(true);
      expect(machine.supplies.water).toBe(DEFAULT_SUPPLIES.water - RECIPES.latte.water);
      expect(machine.supplies.milk).toBe(DEFAULT_SUPPLIES.milk - RECIPES.latte.milk);
      expect(machine.supplies.beans).toBe(DEFAULT_SUPPLIES.beans - RECIPES.latte.beans);
      expect(machine.supplies.cups).toBe(DEFAULT_SUPPLIES.cups - RECIPES.latte.cups);
      expect(machine.supplies.money).toBe(DEFAULT_SUPPLIES.money + RECIPES.latte.money);
    });

    test('should successfully brew cappuccino', () => {
      const result = machine.brew('cappuccino');

      expect(result.success).toBe(true);
      expect(machine.supplies.water).toBe(DEFAULT_SUPPLIES.water - RECIPES.cappuccino.water);
      expect(machine.supplies.milk).toBe(DEFAULT_SUPPLIES.milk - RECIPES.cappuccino.milk);
      expect(machine.supplies.beans).toBe(DEFAULT_SUPPLIES.beans - RECIPES.cappuccino.beans);
      expect(machine.supplies.cups).toBe(DEFAULT_SUPPLIES.cups - RECIPES.cappuccino.cups);
      expect(machine.supplies.money).toBe(DEFAULT_SUPPLIES.money + RECIPES.cappuccino.money);
    });

    test('should return error for unknown drink', () => {
      const result = machine.brew('mocha');

      expect(result.success).toBe(false);
      expect(result.reason).toBe('Unknown drink');
      expect(machine.supplies).toEqual(DEFAULT_SUPPLIES);
    });

    test('should return error when not enough ingredients', () => {
      const lowSupplies = { water: 10, milk: 10, beans: 5, cups: 1, money: 0 };
      const lowMachine = new CoffeeMachine({ supplies: lowSupplies });

      const result = lowMachine.brew('latte');

      expect(result.success).toBe(false);
      expect(result.reason).toBe('Not enough ingredients');
      expect(lowMachine.supplies).toEqual(lowSupplies);
    });

    test('should not modify supplies on failed brew', () => {
      const initialSupplies = { ...machine.supplies };
      machine.brew('unknownDrink');

      expect(machine.supplies).toEqual(initialSupplies);
    });

    test('should accumulate money from multiple brews', () => {
      machine.brew('espresso');
      machine.brew('latte');

      const expectedMoney = DEFAULT_SUPPLIES.money + RECIPES.espresso.money + RECIPES.latte.money;
      expect(machine.supplies.money).toBe(expectedMoney);
    });
  });

  describe('refill', () => {
    test('should refill all supplies', () => {
      machine.brew('latte'); // Use some supplies

      machine.refill({ water: 100, milk: 100, beans: 50, cups: 5 });

      expect(machine.supplies.water).toBe(DEFAULT_SUPPLIES.water - RECIPES.latte.water + 100);
      expect(machine.supplies.milk).toBe(DEFAULT_SUPPLIES.milk - RECIPES.latte.milk + 100);
      expect(machine.supplies.beans).toBe(DEFAULT_SUPPLIES.beans - RECIPES.latte.beans + 50);
      expect(machine.supplies.cups).toBe(DEFAULT_SUPPLIES.cups - RECIPES.latte.cups + 5);
    });

    test('should refill only water', () => {
      const initialSupplies = { ...machine.supplies };
      machine.refill({ water: 200 });

      expect(machine.supplies.water).toBe(initialSupplies.water + 200);
      expect(machine.supplies.milk).toBe(initialSupplies.milk);
      expect(machine.supplies.beans).toBe(initialSupplies.beans);
      expect(machine.supplies.cups).toBe(initialSupplies.cups);
    });

    test('should refill only milk', () => {
      const initialSupplies = { ...machine.supplies };
      machine.refill({ milk: 150 });

      expect(machine.supplies.milk).toBe(initialSupplies.milk + 150);
      expect(machine.supplies.water).toBe(initialSupplies.water);
    });

    test('should refill only beans', () => {
      const initialSupplies = { ...machine.supplies };
      machine.refill({ beans: 75 });

      expect(machine.supplies.beans).toBe(initialSupplies.beans + 75);
      expect(machine.supplies.water).toBe(initialSupplies.water);
    });

    test('should refill only cups', () => {
      const initialSupplies = { ...machine.supplies };
      machine.refill({ cups: 10 });

      expect(machine.supplies.cups).toBe(initialSupplies.cups + 10);
      expect(machine.supplies.water).toBe(initialSupplies.water);
    });

    test('should handle empty refill object', () => {
      const initialSupplies = { ...machine.supplies };
      machine.refill({});

      expect(machine.supplies).toEqual(initialSupplies);
    });

    test('should not affect money', () => {
      const initialMoney = machine.supplies.money;
      machine.refill({ water: 100, milk: 100, beans: 50, cups: 5 });

      expect(machine.supplies.money).toBe(initialMoney);
    });
  });

  describe('takeMoney', () => {
    test('should return all money and reset to zero', () => {
      machine.brew('espresso');
      machine.brew('latte');

      const expectedMoney = DEFAULT_SUPPLIES.money + RECIPES.espresso.money + RECIPES.latte.money;
      const takenMoney = machine.takeMoney();

      expect(takenMoney).toBe(expectedMoney);
      expect(machine.supplies.money).toBe(0);
    });

    test('should return zero when no money available', () => {
      const emptyMachine = new CoffeeMachine({ supplies: { ...DEFAULT_SUPPLIES, money: 0 } });

      const takenMoney = emptyMachine.takeMoney();

      expect(takenMoney).toBe(0);
      expect(emptyMachine.supplies.money).toBe(0);
    });

    test('should only affect money, not other supplies', () => {
      const initialWater = machine.supplies.water;
      const initialMilk = machine.supplies.milk;
      const initialBeans = machine.supplies.beans;
      const initialCups = machine.supplies.cups;

      machine.takeMoney();

      expect(machine.supplies.water).toBe(initialWater);
      expect(machine.supplies.milk).toBe(initialMilk);
      expect(machine.supplies.beans).toBe(initialBeans);
      expect(machine.supplies.cups).toBe(initialCups);
    });
  });

  describe('getState', () => {
    test('should return a copy of supplies', () => {
      const state = machine.getState();

      expect(state).toEqual(machine.supplies);
      expect(state).not.toBe(machine.supplies); // Different object reference
    });

    test('should not affect machine state when modifying returned state', () => {
      const state = machine.getState();
      const originalWater = machine.supplies.water;

      state.water = 9999;

      expect(machine.supplies.water).toBe(originalWater);
    });

    test('should reflect current state after operations', () => {
      machine.brew('espresso');
      machine.refill({ water: 100 });

      const state = machine.getState();

      expect(state.water).toBe(DEFAULT_SUPPLIES.water - RECIPES.espresso.water + 100);
      expect(state.money).toBe(DEFAULT_SUPPLIES.money + RECIPES.espresso.money);
    });
  });

  describe('Integration scenarios', () => {
    test('should handle multiple operations correctly', () => {
      // Brew some drinks
      machine.brew('espresso');
      machine.brew('latte');
      machine.brew('cappuccino');

      // Take money
      const money = machine.takeMoney();
      expect(money).toBeGreaterThan(0);
      expect(machine.supplies.money).toBe(0);

      // Refill
      machine.refill({ water: 1000, milk: 1000, beans: 500, cups: 20 });

      // Brew again
      const result = machine.brew('latte');
      expect(result.success).toBe(true);
    });

    test('should prevent brewing when supplies run out', () => {
      const smallMachine = new CoffeeMachine({
        supplies: { water: 700, milk: 150, beans: 40, cups: 2, money: 0 }
      });

      // First latte should work (needs 350 water, 75 milk, 20 beans, 1 cup)
      let result = smallMachine.brew('latte');
      expect(result.success).toBe(true);

      // Second latte should work too
      result = smallMachine.brew('latte');
      expect(result.success).toBe(true);

      // Third latte should fail (not enough cups)
      result = smallMachine.brew('latte');
      expect(result.success).toBe(false);
      expect(result.reason).toBe('Not enough ingredients');
    });

    test('should work with custom recipes and supplies', () => {
      const customRecipes = {
        tea: { water: 200, milk: 0, beans: 0, cups: 1, money: 2 }
      };
      const customSupplies = { water: 300, milk: 0, beans: 0, cups: 2, money: 0 };
      const teaMachine = new CoffeeMachine({ recipes: customRecipes, supplies: customSupplies });

      const result = teaMachine.brew('tea');

      expect(result.success).toBe(true);
      expect(teaMachine.supplies.water).toBe(100);
      expect(teaMachine.supplies.money).toBe(2);
    });
  });
});

