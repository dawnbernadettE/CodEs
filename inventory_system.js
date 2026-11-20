const fs = require('fs');
const readline = require('readline');

const DATA_FILE = 'inventory_data_js.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function loadInventory() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            return [];
        }
    }
    return [];
}

function saveInventory(inventory) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(inventory, null, 4), 'utf8');
}

function prompt(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function addItem(inventory) {
    const id = await prompt("Enter Item ID: ");
    const name = await prompt("Enter Item Name: ");
    const qtyInput = await prompt("Enter Quantity: ");
    const priceInput = await prompt("Enter Price: ");

    const quantity = parseInt(qtyInput, 10);
    const price = parseFloat(priceInput);

    if (isNaN(quantity) || isNaN(price)) {
        console.log("\n[Error] Quantity must be an integer and Price must be a number.");
        return;
    }

    if (inventory.some(item => item.id === id.trim())) {
        console.log("\n[Error] Item ID already exists!");
        return;
    }

    inventory.push({
        id: id.trim(),
        name: name.trim(),
        quantity: quantity,
        price: price
    });

    saveInventory(inventory);
    console.log(`\n[Success] Item '${name.trim()}' added successfully!`);
}

function viewItems(inventory) {
    if (inventory.length === 0) {
        console.log("\nInventory is currently empty.");
        return;
    }

    console.log("\n" + "=".repeat(50));
    console.log("ID          | Name               | Qty    | Price   ");
    console.log("=".repeat(50));
    inventory.forEach(item => {
        console.log(`${item.id.padEnd(11)} | ${item.name.padEnd(18)} | ${String(item.quantity).padEnd(6)} | ${item.price.toFixed(2)}`);
    });
    console.log("=".repeat(50));
}

async function searchItem(inventory) {
    const query = (await prompt("Enter Item Name or ID to search: ")).trim().toLowerCase();
    const found = inventory.filter(item => 
        item.id.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
    );

    if (found.length === 0) {
        console.log("\nNo matching items found.");
        return;
    }

    console.log("\n" + "=".repeat(50));
    console.log("ID          | Name               | Qty    | Price   ");
    console.log("=".repeat(50));
    found.forEach(item => {
        console.log(`${item.id.padEnd(11)} | ${item.name.padEnd(18)} | ${String(item.quantity).padEnd(6)} | ${item.price.toFixed(2)}`);
    });
    console.log("=".repeat(50));
}

async function main() {
    let inventory = loadInventory();
    while (true) {
        console.log("\n--- INVENTORY MANAGEMENT SYSTEM (JAVASCRIPT) ---");
        console.log("1. Add Item");
        console.log("2. View All Items");
        console.log("3. Search Item");
        console.log("0. Exit");

        const choice = (await prompt("Enter your choice (0-3): ")).trim();

        if (choice === '1') {
            await addItem(inventory);
        } else if (choice === '2') {
            viewItems(inventory);
        } else if (choice === '3') {
            await searchItem(inventory);
        } else if (choice === '0') {
            console.log("\nExiting program. Goodbye!");
            rl.close();
            break;
        } else {
            console.log("\n[Error] Invalid choice. Please try again.");
        }
    }
}

main();