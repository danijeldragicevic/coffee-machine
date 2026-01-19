import { machine, handleBuy, handleFill, handleTake } from '../../src/cli/main.js';
import inquirer from 'inquirer';

// Simple mock setup
inquirer.prompt = (options) => {
  return Promise.resolve(mockAnswer);
};

let mockAnswer = null;
let consoleMessages = [];

// Capture console output
console.log = (message) => consoleMessages.push(message);

describe('Coffee Machine Tests', () => {

  beforeEach(() => {
    machine.supplies.water = 1000;
    machine.supplies.milk = 1000;
    machine.supplies.beans = 1000;
    machine.supplies.cups = 100;
    machine.supplies.money = 500;
    consoleMessages = [];
  });

  describe('Buying Coffee', () => {
    test('brewing espresso uses water, beans and cups', async () => {
      mockAnswer = { drink: 'espresso' };
      await handleBuy();
      expect(machine.supplies.water).toBe(750);
      expect(machine.supplies.beans).toBe(984);
      expect(machine.supplies.cups).toBe(99);
    });

    test('brewing espresso adds money', async () => {
      mockAnswer = { drink: 'espresso' };
      await handleBuy();
      expect(machine.supplies.money).toBe(504);
    });

    test('unknown drink shows error', async () => {
      mockAnswer = { drink: 'mocha' };
      await handleBuy();
      expect(consoleMessages.join(' ')).toContain('Unknown drink');
    });

    test('not enough water shows error', async () => {
      machine.supplies.water = 10;
      mockAnswer = { drink: 'latte' };
      await handleBuy();
      expect(consoleMessages.join(' ')).toContain('Not enough ingredients');
    });
  });

  describe('Refilling Supplies', () => {
    test('adding water increases only water supply', async () => {
      mockAnswer = { water: 500, milk: 0, beans: 0, cups: 0 };
      await handleFill();
      expect(machine.supplies.water).toBe(1500);
    });

    test('adding all supplies increases all', async () => {
      mockAnswer = { water: 200, milk: 300, beans: 100, cups: 50 };
      await handleFill();
      expect(machine.supplies.water).toBe(1200);
      expect(machine.supplies.milk).toBe(1300);
      expect(machine.supplies.beans).toBe(1100);
      expect(machine.supplies.cups).toBe(150);
    });
  });

  describe('Taking Money', () => {
    test('taking money empties the cash', async () => {
      await handleTake();
      expect(machine.supplies.money).toBe(0);
    });

    test('taking money shows amount', async () => {
      await handleTake();
      expect(consoleMessages.join(' ')).toContain('You took $500');
    });
  });

  describe('Complete Workflow', () => {
    test('buy coffee then take money', async () => {
      // Buy espresso
      mockAnswer = { drink: 'espresso' };
      await handleBuy();
      expect(machine.supplies.money).toBe(504);

      // Take money
      consoleMessages = [];
      await handleTake();
      expect(machine.supplies.money).toBe(0);
      expect(consoleMessages.join(' ')).toContain('You took $504');
    });

    test('refill then buy coffee', async () => {
      // Refill
      mockAnswer = { water: 500, milk: 0, beans: 0, cups: 0 }; // 1000 + 500 = 1500 water
      await handleFill();

      // Buy latte
      mockAnswer = { drink: 'latte' };
      await handleBuy();

      expect(machine.supplies.water).toBe(1150); // 1500 - 350
    });
  });
});
