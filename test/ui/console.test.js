import { showState, showMessage, showError } from '../../src/ui/console.js';
import chalk from 'chalk';

// Mock console.log to capture output
let consoleOutput = [];
const mockLog = (output) => consoleOutput.push(output);

beforeEach(() => {
    consoleOutput = [];
    console.log = mockLog;
});

describe('Console UI functions', () => {
    test('showState displays machine state', () => {
        const state = { water: 400, milk: 540, beans: 120, cups: 9, money: 550 };

        showState(state);

        expect(consoleOutput[0]).toBe(chalk.yellow("\nThe coffee machine has:"));
        expect(consoleOutput[1]).toBe('400 ml water');
        expect(consoleOutput[5]).toBe('$550\n');
    });

    test('showMessage displays in green', () => {
        showMessage('Test message');

        expect(consoleOutput[0]).toBe(chalk.green('Test message'));
    });

    test('showError displays in red', () => {
        showError('Error message');

        expect(consoleOutput[0]).toBe(chalk.red('Error message'));
    });
});
