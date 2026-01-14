import { DEFAULT_SUPPLIES } from "../../src/data/supplies.js";

describe('Default Supplies', () => {
    test('DEFAULT_SUPPLIES has correct initial values', () => {
        expect(DEFAULT_SUPPLIES).toEqual({
            water: 1000,
            milk: 1000,
            beans: 1000,
            cups: 100,
            money: 500
        });
    });

    test('All supplies are non-negative numbers', () => {
        Object.values(DEFAULT_SUPPLIES).forEach(value => {
            expect(typeof value).toBe('number');
            expect(value).toBeGreaterThanOrEqual(0);
        });
    });
});