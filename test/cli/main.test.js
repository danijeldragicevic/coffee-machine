import { machine, handleBuy, handleFill, handleTake, main } from '../../src/cli/main.js';
import inquirer from 'inquirer';

// Mock inquirer.prompt
let mockPromptResolveValue = null;
inquirer.prompt = (options) => {
  return Promise.resolve(mockPromptResolveValue);
};

// Mock console.log to capture output
let consoleOutput = [];
const originalLog = console.log;
console.log = (output) => consoleOutput.push(output);

describe('Main CLI Handlers', () => {
  beforeEach(() => {
    // Reset machine state before each test
    machine.supplies.water = 1000;
    machine.supplies.milk = 1000;
    machine.supplies.beans = 1000;
    machine.supplies.cups = 100;
    machine.supplies.money = 500;

    // Clear mock state
    mockPromptResolveValue = null;
    consoleOutput = [];
  });

  describe('handleBuy', () => {
    test('should successfully brew espresso and update supplies', async () => {
      mockPromptResolveValue = { drink: 'espresso' };

      await handleBuy();

      expect(machine.supplies.water).toBe(750); // 1000 - 250
      expect(machine.supplies.beans).toBe(984); // 1000 - 16
      expect(machine.supplies.cups).toBe(99); // 100 - 1
      expect(machine.supplies.money).toBe(504); // 500 + 4
      expect(consoleOutput.join(' ')).toContain('Brewing your coffee');
    });

    test('should successfully brew latte and update supplies', async () => {
      mockPromptResolveValue = { drink: 'latte' };

      await handleBuy();

      expect(machine.supplies.water).toBe(650); // 1000 - 350
      expect(machine.supplies.milk).toBe(925); // 1000 - 75
      expect(machine.supplies.beans).toBe(980); // 1000 - 20
      expect(machine.supplies.cups).toBe(99); // 100 - 1
      expect(machine.supplies.money).toBe(507); // 500 + 7
      expect(consoleOutput.join(' ')).toContain('Brewing your coffee');
    });

    test('should successfully brew cappuccino and update supplies', async () => {
      mockPromptResolveValue = { drink: 'cappuccino' };

      await handleBuy();

      expect(machine.supplies.water).toBe(800); // 1000 - 200
      expect(machine.supplies.milk).toBe(900); // 1000 - 100
      expect(machine.supplies.beans).toBe(988); // 1000 - 12
      expect(machine.supplies.cups).toBe(99); // 100 - 1
      expect(machine.supplies.money).toBe(506); // 500 + 6
      expect(consoleOutput.join(' ')).toContain('Brewing your coffee');
    });

    test('should show error for unknown drink', async () => {
      mockPromptResolveValue = { drink: 'mocha' };
      const initialSupplies = { ...machine.supplies };

      await handleBuy();

      expect(machine.supplies).toEqual(initialSupplies);
      expect(consoleOutput.join(' ')).toContain('Unknown drink');
    });

    test('should show error when not enough ingredients', async () => {
      mockPromptResolveValue = { drink: 'latte' };
      machine.supplies.water = 10;
      machine.supplies.milk = 10;
      machine.supplies.beans = 5;

      const initialSupplies = { ...machine.supplies };

      await handleBuy();

      expect(machine.supplies).toEqual(initialSupplies);
      expect(consoleOutput.join(' ')).toContain('Not enough ingredients');
    });

    test('should handle multiple successful brews', async () => {
      mockPromptResolveValue = { drink: 'espresso' };
      await handleBuy();

      mockPromptResolveValue = { drink: 'latte' };
      await handleBuy();

      mockPromptResolveValue = { drink: 'cappuccino' };
      await handleBuy();

      expect(machine.supplies.water).toBe(200); // 1000 - 250 - 350 - 200
      expect(machine.supplies.milk).toBe(825); // 1000 - 75 - 100
      expect(machine.supplies.beans).toBe(952); // 1000 - 16 - 20 - 12
      expect(machine.supplies.cups).toBe(97); // 100 - 3
      expect(machine.supplies.money).toBe(517); // 500 + 4 + 7 + 6
    });
  });

  describe('handleFill', () => {
    test('should refill all supplies', async () => {
      const refillValues = { water: 500, milk: 300, beans: 200, cups: 50 };
      mockPromptResolveValue = refillValues;

      await handleFill();

      expect(machine.supplies.water).toBe(1500); // 1000 + 500
      expect(machine.supplies.milk).toBe(1300); // 1000 + 300
      expect(machine.supplies.beans).toBe(1200); // 1000 + 200
      expect(machine.supplies.cups).toBe(150); // 100 + 50
      expect(machine.supplies.money).toBe(500); // unchanged
    });

    test('should refill only water', async () => {
      mockPromptResolveValue = { water: 1000, milk: 0, beans: 0, cups: 0 };

      await handleFill();

      expect(machine.supplies.water).toBe(2000);
      expect(machine.supplies.milk).toBe(1000);
      expect(machine.supplies.beans).toBe(1000);
      expect(machine.supplies.cups).toBe(100);
    });

    test('should handle refill with zero values', async () => {
      mockPromptResolveValue = { water: 0, milk: 0, beans: 0, cups: 0 };
      const initialSupplies = { ...machine.supplies };

      await handleFill();

      expect(machine.supplies).toEqual(initialSupplies);
    });

    test('should not affect money when refilling', async () => {
      mockPromptResolveValue = { water: 500, milk: 500, beans: 500, cups: 50 };
      const initialMoney = machine.supplies.money;

      await handleFill();

      expect(machine.supplies.money).toBe(initialMoney);
    });

    test('should handle multiple refills', async () => {
      mockPromptResolveValue = { water: 500, milk: 0, beans: 0, cups: 0 };
      await handleFill();
      expect(machine.supplies.water).toBe(1500);

      mockPromptResolveValue = { water: 500, milk: 0, beans: 0, cups: 0 };
      await handleFill();
      expect(machine.supplies.water).toBe(2000);
    });
  });

  describe('handleTake', () => {
    test('should take all money and show correct message', async () => {
      await handleTake();

      expect(machine.supplies.money).toBe(0);
      expect(consoleOutput.join(' ')).toContain('You took $500');
    });

    test('should take zero money when empty', async () => {
      machine.supplies.money = 0;

      await handleTake();

      expect(machine.supplies.money).toBe(0);
      expect(consoleOutput.join(' ')).toContain('You took $0');
    });

    test('should handle taking money after brewing', async () => {
      mockPromptResolveValue = { drink: 'espresso' };
      await handleBuy();

      consoleOutput = []; // Clear previous output
      mockPromptResolveValue = { drink: 'latte' };
      await handleBuy();

      consoleOutput = []; // Clear previous output
      await handleTake();

      expect(machine.supplies.money).toBe(0);
      expect(consoleOutput.join(' ')).toContain('You took $511');
    });

    test('should not affect other supplies', async () => {
      const initialWater = machine.supplies.water;
      const initialMilk = machine.supplies.milk;
      const initialBeans = machine.supplies.beans;
      const initialCups = machine.supplies.cups;

      await handleTake();

      expect(machine.supplies.water).toBe(initialWater);
      expect(machine.supplies.milk).toBe(initialMilk);
      expect(machine.supplies.beans).toBe(initialBeans);
      expect(machine.supplies.cups).toBe(initialCups);
    });

    test('should allow taking money multiple times', async () => {
      await handleTake();
      expect(machine.supplies.money).toBe(0);

      mockPromptResolveValue = { drink: 'espresso' };
      await handleBuy();

      consoleOutput = []; // Clear previous output
      await handleTake();
      expect(consoleOutput.join(' ')).toContain('You took $4');
      expect(machine.supplies.money).toBe(0);
    });
  });

  describe('Integration workflows', () => {
    test('should handle complete workflow: buy, refill, buy, take', async () => {
      mockPromptResolveValue = { drink: 'espresso' };
      await handleBuy();
      expect(machine.supplies.money).toBe(504);

      mockPromptResolveValue = { water: 500, milk: 0, beans: 50, cups: 0 };
      await handleFill();
      expect(machine.supplies.water).toBe(1250);

      mockPromptResolveValue = { drink: 'latte' };
      await handleBuy();
      expect(machine.supplies.money).toBe(511);

      consoleOutput = []; // Clear previous output
      await handleTake();
      expect(consoleOutput.join(' ')).toContain('You took $511');
      expect(machine.supplies.money).toBe(0);
    });

    test('should handle failed purchase, refill, then successful purchase', async () => {
      machine.supplies.water = 100;
      machine.supplies.milk = 50;
      machine.supplies.beans = 10;
      machine.supplies.cups = 1;

      mockPromptResolveValue = { drink: 'latte' };
      await handleBuy();
      expect(consoleOutput.join(' ')).toContain('Not enough ingredients');

      mockPromptResolveValue = { water: 1000, milk: 1000, beans: 500, cups: 50 };
      await handleFill();

      consoleOutput = []; // Clear previous output
      mockPromptResolveValue = { drink: 'latte' };
      await handleBuy();
      expect(consoleOutput.join(' ')).toContain('Brewing your coffee');
    });

    test('should accumulate money from multiple purchases', async () => {
      const initialMoney = machine.supplies.money;

      mockPromptResolveValue = { drink: 'espresso' };
      await handleBuy();

      mockPromptResolveValue = { drink: 'latte' };
      await handleBuy();

      mockPromptResolveValue = { drink: 'cappuccino' };
      await handleBuy();

      const expectedMoney = initialMoney + 4 + 7 + 6;
      expect(machine.supplies.money).toBe(expectedMoney);
    });

    test('should maintain state consistency after complex operations', async () => {
      mockPromptResolveValue = { drink: 'espresso' };
      await handleBuy();

      mockPromptResolveValue = { water: 250, milk: 0, beans: 16, cups: 1 };
      await handleFill();

      consoleOutput = []; // Clear previous output
      await handleTake();

      expect(machine.supplies.water).toBe(1000); // back to start
      expect(machine.supplies.beans).toBe(1000); // back to start
      expect(machine.supplies.cups).toBe(100); // back to start
      expect(machine.supplies.money).toBe(0); // taken
      expect(consoleOutput.join(' ')).toContain('You took $504');
    });

    test('should prevent operations when supplies depleted', async () => {
      // Only 4 espressos should succeed (limited by water: 1000/250 = 4)
      for (let i = 0; i < 4; i++) {
        mockPromptResolveValue = { drink: 'espresso' };
        await handleBuy();
      }

      expect(machine.supplies.water).toBe(0);

      // 5th attempt should fail
      consoleOutput = []; // Clear previous output
      mockPromptResolveValue = { drink: 'espresso' };
      await handleBuy();
      expect(consoleOutput.join(' ')).toContain('Not enough ingredients');
    });
  });

  describe('Machine state validation', () => {
    test('should never have negative supplies after failed brew', async () => {
      machine.supplies.water = 100;

      mockPromptResolveValue = { drink: 'latte' };
      await handleBuy();

      expect(consoleOutput.join(' ')).toContain('Not enough ingredients');
      expect(machine.supplies.water).toBeGreaterThanOrEqual(0);
      expect(machine.supplies.milk).toBeGreaterThanOrEqual(0);
      expect(machine.supplies.beans).toBeGreaterThanOrEqual(0);
      expect(machine.supplies.cups).toBeGreaterThanOrEqual(0);
    });

    test('should return correct state with getState()', async () => {
      mockPromptResolveValue = { drink: 'espresso' };
      await handleBuy();
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
    test('should handle brewing all three drinks in sequence', async () => {
      const drinks = ['espresso', 'latte', 'cappuccino'];

      for (const drink of drinks) {
        mockPromptResolveValue = { drink };
        await handleBuy();
      }

      expect(machine.supplies.cups).toBe(97); // 100 - 3
      expect(consoleOutput.filter(msg => String(msg).includes('Brewing')).length).toBe(3);
    });

    test('should handle zero refill correctly', async () => {
      const stateBefore = machine.getState();
      mockPromptResolveValue = {};
      await handleFill();

      const stateAfter = machine.getState();
      expect(stateAfter).toEqual(stateBefore);
    });

    test('should handle taking money when no drinks were sold', async () => {
      await handleTake();

      expect(consoleOutput.join(' ')).toContain('You took $500');
      expect(machine.supplies.money).toBe(0);
    });

    test('should handle case-sensitive drink names', async () => {
      mockPromptResolveValue = { drink: 'Espresso' };
      await handleBuy();

      expect(consoleOutput.join(' ')).toContain('Unknown drink');
    });
  });

  describe('main function', () => {
    test('should handle exit action and terminate loop', async () => {
      let callCount = 0;
      inquirer.prompt = (options) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ action: 'exit' });
        }
        return Promise.resolve({ action: 'exit' });
      };

      await main();

      expect(callCount).toBe(1);
    });

    test('should handle buy action in main loop', async () => {
      let callCount = 0;
      inquirer.prompt = (options) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ action: 'buy' });
        } else if (callCount === 2) {
          return Promise.resolve({ drink: 'espresso' });
        } else {
          return Promise.resolve({ action: 'exit' });
        }
      };

      await main();

      expect(machine.supplies.water).toBe(750);
      expect(callCount).toBe(3);
    });

    test('should handle fill action in main loop', async () => {
      let callCount = 0;
      inquirer.prompt = (options) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ action: 'fill' });
        } else if (callCount === 2) {
          return Promise.resolve({ water: 500, milk: 0, beans: 0, cups: 0 });
        } else {
          return Promise.resolve({ action: 'exit' });
        }
      };

      await main();

      expect(machine.supplies.water).toBe(1500);
      expect(callCount).toBe(3);
    });

    test('should handle take action in main loop', async () => {
      let callCount = 0;
      inquirer.prompt = (options) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ action: 'take' });
        } else {
          return Promise.resolve({ action: 'exit' });
        }
      };

      await main();

      expect(machine.supplies.money).toBe(0);
      expect(callCount).toBe(2);
    });

    test('should handle unknown action', async () => {
      let callCount = 0;
      inquirer.prompt = (options) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ action: 'invalid' });
        } else {
          return Promise.resolve({ action: 'exit' });
        }
      };

      consoleOutput = [];
      await main();

      expect(consoleOutput.join(' ')).toContain('Unknown action');
      expect(callCount).toBe(2);
    });

    test('should show state after each action', async () => {
      let callCount = 0;
      inquirer.prompt = (options) => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({ action: 'buy' });
        } else if (callCount === 2) {
          return Promise.resolve({ drink: 'espresso' });
        } else {
          return Promise.resolve({ action: 'exit' });
        }
      };

      consoleOutput = [];
      await main();

      // Should show state after buy action
      const stateOutput = consoleOutput.join(' ');
      expect(stateOutput).toContain('coffee machine has');
    });
  });
});

