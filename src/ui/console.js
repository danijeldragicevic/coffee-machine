import chalk from "chalk";

export function showState(state) {
    console.log(chalk.yellow("\nThe coffee machine has:"));
    console.log(`${state.water} ml water`);
    console.log(`${state.milk} ml milk`);
    console.log(`${state.beans} g beans`);
    console.log(`${state.cups} cups`);
    console.log(`$${state.money}\n`);
}

export function showMessage(message) {
    console.log(chalk.green(message));
}

export function showError(message) {
    console.log(chalk.red(message));
}
