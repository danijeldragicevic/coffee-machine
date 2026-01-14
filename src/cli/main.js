import inquirer from "inquirer";
import { showState, showMessage, showError} from "../ui/console.js";
import { actionPrompt, drinkPrompt, refillPrompt} from "./prompts.js";
import {CoffeeMachine} from "../domain/coffeeMachine.js";

const machine = new CoffeeMachine();

// Export for testing
export { machine };

// Main loop
export async function main() {
    let running = true;

    while (running) {
        const { action } = await inquirer.prompt(actionPrompt);
        switch (action) {
            case "buy":
                await handleBuy()
                break;
            case "fill":
                await handleFill();
                break;
            case "take":
                await handleTake();
                break;
            case "exit":
                running = false;
                continue;
            default:
                showError("Unknown action");
        }
        showState(machine.getState());
    }
}

// Only run main if this file is executed directly (not imported in tests)
if (process.argv[1] && process.argv[1].endsWith('main.js')) {
    main().catch(error => {
        showError(error);
        process.exit(1);
    });
}

// Handlers
export async function handleBuy() {
    const { drink } = await inquirer.prompt(drinkPrompt);
    const result = machine.brew(drink);

    if (result.success) {
        showMessage("☕ Brewing your coffee...");
    } else {
        showError(result.reason);
    }
}

export async function handleFill() {
    const refill = await inquirer.prompt(refillPrompt);
    machine.refill(refill);
}

export async function handleTake() {
    const money = machine.takeMoney();
    showMessage(`💰 You took $${money}`);
}