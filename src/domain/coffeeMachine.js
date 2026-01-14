import { RECIPES } from "../data/recipees.js";
import { DEFAULT_SUPPLIES } from "../data/supplies.js";

export class CoffeeMachine {
    constructor({
            recipes = RECIPES,
            supplies = DEFAULT_SUPPLIES } = {}) {

        this.recipes = recipes;
        this.supplies = { ...DEFAULT_SUPPLIES, ...supplies };
    }

    canBrew(recipe) {
        return (
            this.supplies.water >= recipe.water &&
            this.supplies.milk >= recipe.milk &&
            this.supplies.beans >= recipe.beans &&
            this.supplies.cups >= recipe.cups
        );
    }

    brew(drinkName) {
        const recipe = this.recipes[drinkName];
        if (!recipe) {
            return { success: false, reason: "Unknown drink" };
        }

        if (!this.canBrew(recipe)) {
            return { success: false, reason: "Not enough ingredients" };
        }

        const resourceKeys = ["water", "milk", "beans", "cups"];
        resourceKeys.forEach(key => {
            this.supplies[key] -= recipe[key];
        });

        this.supplies.money += recipe.money;
        return { success: true };
    }

    refill({ water = 0, milk = 0, beans = 0, cups = 0 }) {
        this.supplies.water += water;
        this.supplies.milk += milk;
        this.supplies.beans += beans;
        this.supplies.cups += cups;
    }

    takeMoney() {
        const money = this.supplies.money;
        this.supplies.money = 0;
        return money;
    }

    getState() {
        return { ...this.supplies };
    }
}