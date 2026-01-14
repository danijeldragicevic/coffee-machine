# ☕ Coffee Machine CLI

[![Run Tests](https://github.com/danijeldragicevic/coffee-machine/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/danijeldragicevic/coffee-machine/actions/workflows/test.yml)

A command-line interface application for simulating a coffee machine, built with Node.js.

## Features
- **Buy Coffee**: Choose from espresso, latte, or cappuccino
- **Refill Supplies**: Add water, milk, beans, and cups to the machine
- **Take Money**: Collect accumulated money from coffee sales
- **View State**: See current supply levels after each operation
- **Interactive CLI**: User-friendly command-line interface

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation
1. Clone the repository or navigate to the project directory:
   ```bash
   cd coffee-machine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
Start the coffee machine:
```bash
npm start
```
The application starts with default supplies: 1000 ml water, 1000 ml milk, 1000 g beans, 100 cups, and $0.

### Running Tests
Run all tests:
```bash
npm test
```

### Coffee Recipes

| Drink | Water | Milk | Beans | Cups | Price |
|-------|-------|------|-------|------|-------|
| Espresso | 250ml | 0ml | 16g | 1 | $4 |
| Latte | 350ml | 75ml | 20g | 1 | $7 |
| Cappuccino | 200ml | 100ml | 12g | 1 | $6 |

## Usage
You will be prompted to choose an action: `buy`, `fill`, `take`, or `exit`.

#### 1. Buy Coffee
Select and purchase a coffee type. The machine deducts the required supplies and adds the cost to the total money.
```bash
✔ Choose an action (buy, fill, take, exit): buy
✔ Choose your drink (espresso, latte, cappuccino): espresso
☕ Brewing your coffee...

The coffee machine has:
750 ml water
1000 ml milk
984 g beans
99 cups
$504
```

#### 2. Fill Supplies
Refill the machine's supplies by adding water, milk, beans, and cups.
```bash
✔ Choose an action (buy, fill, take, exit): fill
✔ Water (ml): 100
✔ Milk (ml): 100
✔ Beans (g): 100
✔ Cups: 100

The coffee machine has:
1100 ml water
1100 ml milk
1100 g beans
200 cups
$500
```

#### 3. Take Money
Withdraw all collected money from the machine, resetting the balance to $0.
```bash
✔ Choose an action (buy, fill, take, exit): take
💰 You took $500

The coffee machine has:
1000 ml water
1000 ml milk
1000 g beans
100 cups
$0
```

#### 4. Exit
```bash
✔ Choose an action (buy, fill, take, exit): exit
```

## Technologies
- **Node.js**: JavaScript runtime environment (ES modules)
- **Inquirer.js** (^13.1.0): Interactive command-line prompts
- **Chalk** (^5.6.2): Terminal string styling
- **Jest** (^30.2.0): Testing framework

## Ideas for Enhancement
- Add more coffee types (mocha, americano, macchiato)
- Implement data persistence (save/load machine state)
- Add usage statistics (drinks sold, revenue)
- Create a web interface
- Add user authentication
- Implement inventory alerts (low supply warnings)
- Add customizable recipe configuration

## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue.

## License
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
