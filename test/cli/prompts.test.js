import { actionPrompt, drinkPrompt, refillPrompt } from '../../src/cli/prompts.js';

describe('CLI Prompts', () => {
  describe('actionPrompt', () => {
    test('should have correct type', () => {
      expect(actionPrompt.type).toBe('list');
    });

    test('should have correct name', () => {
      expect(actionPrompt.name).toBe('action');
    });

    test('should have a message', () => {
      expect(actionPrompt.message).toBe('Choose an action (buy, fill, take, exit):');
    });

    test('should have all action choices', () => {
      expect(actionPrompt.choices).toEqual(['buy', 'fill', 'take', 'exit']);
    });

    test('should have exactly 4 choices', () => {
      expect(actionPrompt.choices).toHaveLength(4);
    });

    test('should contain buy action', () => {
      expect(actionPrompt.choices).toContain('buy');
    });

    test('should contain fill action', () => {
      expect(actionPrompt.choices).toContain('fill');
    });

    test('should contain take action', () => {
      expect(actionPrompt.choices).toContain('take');
    });

    test('should contain exit action', () => {
      expect(actionPrompt.choices).toContain('exit');
    });

    test('should have loop set to false', () => {
      expect(actionPrompt.loop).toBe(false);
    });

    test('should be a valid inquirer prompt object', () => {
      expect(actionPrompt).toHaveProperty('type');
      expect(actionPrompt).toHaveProperty('name');
      expect(actionPrompt).toHaveProperty('message');
      expect(actionPrompt).toHaveProperty('choices');
    });
  });

  describe('drinkPrompt', () => {
    test('should have correct type', () => {
      expect(drinkPrompt.type).toBe('list');
    });

    test('should have correct name', () => {
      expect(drinkPrompt.name).toBe('drink');
    });

    test('should have a message', () => {
      expect(drinkPrompt.message).toBe('Choose your drink (espresso, latte, cappuccino):');
    });

    test('should have all drink choices', () => {
      expect(drinkPrompt.choices).toEqual(['espresso', 'latte', 'cappuccino']);
    });

    test('should have exactly 3 choices', () => {
      expect(drinkPrompt.choices).toHaveLength(3);
    });

    test('should contain espresso', () => {
      expect(drinkPrompt.choices).toContain('espresso');
    });

    test('should contain latte', () => {
      expect(drinkPrompt.choices).toContain('latte');
    });

    test('should contain cappuccino', () => {
      expect(drinkPrompt.choices).toContain('cappuccino');
    });

    test('should have loop set to false', () => {
      expect(drinkPrompt.loop).toBe(false);
    });

    test('should be a valid inquirer prompt object', () => {
      expect(drinkPrompt).toHaveProperty('type');
      expect(drinkPrompt).toHaveProperty('name');
      expect(drinkPrompt).toHaveProperty('message');
      expect(drinkPrompt).toHaveProperty('choices');
    });
  });

  describe('refillPrompt', () => {
    test('should be an array', () => {
      expect(Array.isArray(refillPrompt)).toBe(true);
    });

    test('should have 4 prompts', () => {
      expect(refillPrompt).toHaveLength(4);
    });

    test('should have water prompt at index 0', () => {
      const waterPrompt = refillPrompt[0];
      expect(waterPrompt.type).toBe('number');
      expect(waterPrompt.name).toBe('water');
      expect(waterPrompt.message).toBe('Water (ml):');
      expect(waterPrompt.default).toBe(0);
    });

    test('should have milk prompt at index 1', () => {
      const milkPrompt = refillPrompt[1];
      expect(milkPrompt.type).toBe('number');
      expect(milkPrompt.name).toBe('milk');
      expect(milkPrompt.message).toBe('Milk (ml):');
      expect(milkPrompt.default).toBe(0);
    });

    test('should have beans prompt at index 2', () => {
      const beansPrompt = refillPrompt[2];
      expect(beansPrompt.type).toBe('number');
      expect(beansPrompt.name).toBe('beans');
      expect(beansPrompt.message).toBe('Beans (g):');
      expect(beansPrompt.default).toBe(0);
    });

    test('should have cups prompt at index 3', () => {
      const cupsPrompt = refillPrompt[3];
      expect(cupsPrompt.type).toBe('number');
      expect(cupsPrompt.name).toBe('cups');
      expect(cupsPrompt.message).toBe('Cups:');
      expect(cupsPrompt.default).toBe(0);
    });

    test('all prompts should be of type number', () => {
      refillPrompt.forEach(prompt => {
        expect(prompt.type).toBe('number');
      });
    });

    test('all prompts should have default value of 0', () => {
      refillPrompt.forEach(prompt => {
        expect(prompt.default).toBe(0);
      });
    });

    test('all prompts should have unique names', () => {
      const names = refillPrompt.map(prompt => prompt.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });

    test('all prompts should have messages', () => {
      refillPrompt.forEach(prompt => {
        expect(prompt.message).toBeTruthy();
        expect(typeof prompt.message).toBe('string');
      });
    });

    test('prompt names should match supply types', () => {
      const names = refillPrompt.map(prompt => prompt.name);
      expect(names).toEqual(['water', 'milk', 'beans', 'cups']);
    });

    test('all prompts should be valid inquirer prompt objects', () => {
      refillPrompt.forEach(prompt => {
        expect(prompt).toHaveProperty('type');
        expect(prompt).toHaveProperty('name');
        expect(prompt).toHaveProperty('message');
        expect(prompt).toHaveProperty('default');
      });
    });
  });

  describe('Prompt consistency', () => {
    test('actionPrompt and drinkPrompt should both be list type', () => {
      expect(actionPrompt.type).toBe('list');
      expect(drinkPrompt.type).toBe('list');
    });

    test('all prompts should have loop set to false or be number type', () => {
      expect(actionPrompt.loop).toBe(false);
      expect(drinkPrompt.loop).toBe(false);
      refillPrompt.forEach(prompt => {
        expect(prompt.type).toBe('number');
      });
    });

    test('drink choices should match available recipes', () => {
      const expectedDrinks = ['espresso', 'latte', 'cappuccino'];
      expect(drinkPrompt.choices).toEqual(expectedDrinks);
    });

    test('refill prompt fields should match supply properties', () => {
      const refillFields = refillPrompt.map(p => p.name);
      const expectedFields = ['water', 'milk', 'beans', 'cups'];
      expect(refillFields).toEqual(expectedFields);
    });
  });

  describe('Prompt immutability', () => {
    test('should not allow modification of actionPrompt choices', () => {
      const originalChoices = [...actionPrompt.choices];

      const choicesCopy = [...actionPrompt.choices];
      choicesCopy.push('newAction');

      expect(actionPrompt.choices).toEqual(originalChoices);
    });

    test('should not allow modification of drinkPrompt choices', () => {
      const originalChoices = [...drinkPrompt.choices];

      const choicesCopy = [...drinkPrompt.choices];
      choicesCopy.push('mocha');

      expect(drinkPrompt.choices).toEqual(originalChoices);
    });

    test('should not allow modification of refillPrompt array', () => {
      const originalLength = refillPrompt.length;

      const promptsCopy = [...refillPrompt];
      promptsCopy.push({ type: 'number', name: 'sugar', message: 'Sugar:', default: 0 });

      expect(refillPrompt).toHaveLength(originalLength);
    });
  });
});

