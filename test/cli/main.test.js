import { CoffeeMachine } from '../../src/domain/coffeeMachine.js';

describe('Main CLI Handlers', () => {
  let machine;

  beforeEach(() => {
    machine = new CoffeeMachine();
  });

  describe('handleBuy behavior simulation', () => {
    test('should successfully brew espresso and update supplies', () => {
      const result = machine.brew('espresso');

      expect(result.success).toBe(true);
      expect(machine.supplies.water).toBe(750); // 1000 - 250
      expect(machine.supplies.milk).toBe(1000); // no milk in espresso
      expect(machine.supplies.beans).toBe(984); // 1000 - 16
      expect(machine.supplies.cups).toBe(99); // 100 - 1
      expect(machine.supplies.money).toBe(504); // 500 + 4
    });

    test('should successfully brew latte and update supplies', () => {
      const result = machine.brew('latte');

      expect(result.success).toBe(true);
      expect(machine.supplies.water).toBe(650); // 1000 - 350
      expect(machine.supplies.milk).toBe(925); // 1000 - 75
      expect(machine.supplies.beans).toBe(980); // 1000 - 20
      expect(machine.supplies.cups).toBe(99); // 100 - 1
      expect(machine.supplies.money).toBe(507); // 500 + 7
    });

    test('should successfully brew cappuccino and update supplies', () => {
      const result = machine.brew('cappuccino');

      expect(result.success).toBe(true);
      expect(machine.supplies.water).toBe(800); // 1000 - 200
      expect(machine.supplies.milk).toBe(900); // 1000 - 100
      expect(machine.supplies.beans).toBe(988); // 1000 - 12
      expect(machine.supplies.cups).toBe(99); // 100 - 1
      expect(machine.supplies.money).toBe(506); // 500 + 6
    });

    test('should return error for unknown drink', () => {
      const initialSupplies = { ...machine.supplies };
      const result = machine.brew('mocha');

      expect(result.success).toBe(false);
      expect(result.reason).toBe('Unknown drink');
      expect(machine.supplies).toEqual(initialSupplies);
    });

    test('should return error when not enough ingredients', () => {
      machine.supplies.water = 10;
      machine.supplies.milk = 10;
      machine.supplies.beans = 5;

      const initialSupplies = { ...machine.supplies };
      const result = machine.brew('latte');

      expect(result.success).toBe(false);
      expect(result.reason).toBe('Not enough ingredients');
      expect(machine.supplies).toEqual(initialSupplies);
    });

    test('should handle multiple successful brews', () => {
      machine.brew('espresso');
      machine.brew('latte');
      machine.brew('cappuccino');

      expect(machine.supplies.water).toBe(200); // 1000 - 250 - 350 - 200
      expect(machine.supplies.milk).toBe(825); // 1000 - 75 - 100
      expect(machine.supplies.beans).toBe(952); // 1000 - 16 - 20 - 12
      expect(machine.supplies.cups).toBe(97); // 100 - 3
      expect(machine.supplies.money).toBe(517); // 500 + 4 + 7 + 6
    });
  });

  describe('handleFill behavior simulation', () => {
    test('should refill all supplies', () => {
      const refillValues = { water: 500, milk: 300, beans: 200, cups: 50 };
      machine.refill(refillValues);

      expect(machine.supplies.water).toBe(1500); // 1000 + 500
      expect(machine.supplies.milk).toBe(1300); // 1000 + 300
      expect(machine.supplies.beans).toBe(1200); // 1000 + 200
      expect(machine.supplies.cups).toBe(150); // 100 + 50
      expect(machine.supplies.money).toBe(500); // unchanged
    });

    test('should refill only water', () => {
      machine.refill({ water: 1000, milk: 0, beans: 0, cups: 0 });

      expect(machine.supplies.water).toBe(2000);
      expect(machine.supplies.milk).toBe(1000);
      expect(machine.supplies.beans).toBe(1000);
      expect(machine.supplies.cups).toBe(100);
    });

    test('should handle refill with zero values', () => {
      const initialSupplies = { ...machine.supplies };
      machine.refill({ water: 0, milk: 0, beans: 0, cups: 0 });

      expect(machine.supplies).toEqual(initialSupplies);
    });

    test('should not affect money when refilling', () => {
      const initialMoney = machine.supplies.money;
      machine.refill({ water: 500, milk: 500, beans: 500, cups: 50 });

      expect(machine.supplies.money).toBe(initialMoney);
    });

    test('should handle multiple refills', () => {
      machine.refill({ water: 500, milk: 0, beans: 0, cups: 0 });
      expect(machine.supplies.water).toBe(1500);

      machine.refill({ water: 500, milk: 0, beans: 0, cups: 0 });
      expect(machine.supplies.water).toBe(2000);
    });
  });

  describe('handleTake behavior simulation', () => {
    test('should take all money and reset to zero', () => {
      const money = machine.takeMoney();

      expect(money).toBe(500);
      expect(machine.supplies.money).toBe(0);
    });

    test('should take zero money when empty', () => {
      machine.supplies.money = 0;
      const money = machine.takeMoney();

      expect(money).toBe(0);
      expect(machine.supplies.money).toBe(0);
    });

    test('should handle taking money after brewing', () => {
      machine.brew('espresso');
      machine.brew('latte');

      const money = machine.takeMoney();

      expect(money).toBe(511); // 500 + 4 + 7
      expect(machine.supplies.money).toBe(0);
    });

    test('should not affect other supplies', () => {
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

    test('should allow taking money multiple times', () => {
      const money1 = machine.takeMoney();
      expect(money1).toBe(500);
      expect(machine.supplies.money).toBe(0);

      machine.brew('espresso');

      const money2 = machine.takeMoney();
      expect(money2).toBe(4);
      expect(machine.supplies.money).toBe(0);
    });
  });

  describe('Integration workflows', () => {
    test('should handle complete workflow: buy, refill, buy, take', () => {
      const result1 = machine.brew('espresso');
      expect(result1.success).toBe(true);
      expect(machine.supplies.money).toBe(504);

      machine.refill({ water: 500, milk: 0, beans: 50, cups: 0 });
      expect(machine.supplies.water).toBe(1250);

      const result2 = machine.brew('latte');
      expect(result2.success).toBe(true);
      expect(machine.supplies.money).toBe(511);

      const money = machine.takeMoney();
      expect(money).toBe(511);
      expect(machine.supplies.money).toBe(0);
    });

    test('should handle failed purchase, refill, then successful purchase', () => {
      machine.supplies.water = 100;
      machine.supplies.milk = 50;
      machine.supplies.beans = 10;
      machine.supplies.cups = 1;

      const result1 = machine.brew('latte');
      expect(result1.success).toBe(false);
      expect(result1.reason).toBe('Not enough ingredients');

      machine.refill({ water: 1000, milk: 1000, beans: 500, cups: 50 });

      const result2 = machine.brew('latte');
      expect(result2.success).toBe(true);
    });

    test('should accumulate money from multiple purchases', () => {
      const initialMoney = machine.supplies.money;

      machine.brew('espresso'); // +4
      machine.brew('latte'); // +7
      machine.brew('cappuccino'); // +6

      const expectedMoney = initialMoney + 4 + 7 + 6;
      expect(machine.supplies.money).toBe(expectedMoney);
    });

    test('should maintain state consistency after complex operations', () => {
      machine.brew('espresso');

      machine.refill({ water: 250, milk: 0, beans: 16, cups: 1 });

      const money = machine.takeMoney();

      expect(machine.supplies.water).toBe(1000); // back to start
      expect(machine.supplies.beans).toBe(1000); // back to start
      expect(machine.supplies.cups).toBe(100); // back to start
      expect(machine.supplies.money).toBe(0); // taken
      expect(money).toBe(504); // 500 initial + 4 from espresso
    });

    test('should prevent operations when supplies depleted', () => {
      let successCount = 0;
      for (let i = 0; i < 10; i++) {
        const result = machine.brew('espresso');
        if (result.success) {
          successCount++;
        }
      }

      // Only 4 espressos should succeed (limited by water: 1000/250 = 4)
      expect(successCount).toBe(4);

      const result = machine.brew('espresso');
      expect(result.success).toBe(false);
      expect(result.reason).toBe('Not enough ingredients');
    });
  });

  describe('Machine state validation', () => {
    test('should never have negative supplies after failed brew', () => {
      machine.supplies.water = 100;

      const result = machine.brew('latte');

      expect(result.success).toBe(false);
      expect(machine.supplies.water).toBeGreaterThanOrEqual(0);
      expect(machine.supplies.milk).toBeGreaterThanOrEqual(0);
      expect(machine.supplies.beans).toBeGreaterThanOrEqual(0);
      expect(machine.supplies.cups).toBeGreaterThanOrEqual(0);
    });

    test('should return correct state with getState()', () => {
      machine.brew('espresso');
      const state = machine.getState();

      expect(state).toEqual(machine.supplies);
      expect(state).not.toBe(machine.supplies); // Different reference
    });

    test('should maintain state immutability through getState()', () => {
      const state = machine.getState();
      state.water = 9999;

      expect(machine.supplies.water).toBe(1000); // Unchanged
    });
  });

  describe('Edge cases', () => {
    test('should handle brewing all three drinks in sequence', () => {
      const drinks = ['espresso', 'latte', 'cappuccino'];
      const results = drinks.map(drink => machine.brew(drink));

      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    test('should handle zero refill correctly', () => {
      const stateBefore = machine.getState();
      machine.refill({});

      const stateAfter = machine.getState();
      expect(stateAfter).toEqual(stateBefore);
    });

    test('should handle taking money when no drinks were sold', () => {
      const money = machine.takeMoney();

      expect(money).toBe(500); // Initial money
      expect(machine.supplies.money).toBe(0);
    });

    test('should handle case-sensitive drink names', () => {
      const result = machine.brew('Espresso'); // Capital E

      expect(result.success).toBe(false);
      expect(result.reason).toBe('Unknown drink');
    });
  });
});

