export const actionPrompt = {
    type: "list",
    name: "action",
    message: "Choose an action (buy, fill, take, exit):",
    choices: ["buy", "fill", "take", "exit"],
    loop: false
};

export const drinkPrompt = {
    type: "list",
    name: "drink",
    message: "Choose your drink (espresso, latte, cappuccino):",
    choices: ["espresso", "latte", "cappuccino"],
    loop: false
};

export const refillPrompt = [
    { type: "number", name: "water", message: "Water (ml):", default: 0 },
    { type: "number", name: "milk", message: "Milk (ml):", default: 0 },
    { type: "number", name: "beans", message: "Beans (g):", default: 0 },
    { type: "number", name: "cups", message: "Cups:", default: 0 }
];
