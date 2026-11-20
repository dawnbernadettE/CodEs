import json
import os

DATA_FILE = "inventory_data.json"

def load_inventory():
    """Load inventory list from the JSON data file if it exists."""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []
    return []

def save_inventory(inventory):
    """Save inventory list to a JSON file."""
    with open(DATA_FILE, "w") as f:
        json.dump(inventory, f, indent=4)

def add_item(inventory):
    item_id = input("Enter Item ID: ").strip()
    name = input("Enter Item Name: ").strip()
    
    try:
        quantity = int(input("Enter Quantity: "))
        price = float(input("Enter Price: "))
    except ValueError:
        print("\n[Error] Quantity must be an integer and Price must be a number.")
        return

    # Check if item ID already exists
    for item in inventory:
        if item["id"] == item_id:
            print("\n[Error] Item ID already exists!")
            return

    inventory.append({
        "id": item_id,
        "name": name,
        "quantity": quantity,
        "price": price
    })
    save_inventory(inventory)
    print(f"\n[Success] Item '{name}' added successfully!")

def view_items(inventory):
    if not inventory:
        print("\nInventory is currently empty.")
        return

    print("\n" + "=" * 50)
    print(f"{'ID':<10} | {'Name':<18} | {'Qty':<6} | {'Price':<8}")
    print("=" * 50)
    for item in inventory:
        print(f"{item['id']:<10} | {item['name']:<18} | {item['quantity']:<6} | {item['price']:<8.2f}")
    print("=" * 50)

def search_item(inventory):
    query = input("Enter Item Name or ID to search: ").strip().lower()
    found = [item for item in inventory if query in item['id'].lower() or query in item['name'].lower()]
    
    if not found:
        print("\nNo matching items found.")
        return

    print("\n" + "=" * 50)
    print(f"{'ID':<10} | {'Name':<18} | {'Qty':<6} | {'Price':<8}")
    print("=" * 50)
    for item in found:
        print(f"{item['id']:<10} | {item['name']:<18} | {item['quantity']:<6} | {item['price']:<8.2f}")
    print("=" * 50)

def main():
    inventory = load_inventory()
    while True:
        print("\n--- INVENTORY MANAGEMENT SYSTEM (PYTHON) ---")
        print("1. Add Item")
        print("2. View All Items")
        print("3. Search Item")
        print("0. Exit")
        
        choice = input("Enter your choice (0-3): ").strip()
        
        if choice == '1':
            add_item(inventory)
        elif choice == '2':
            view_items(inventory)
        elif choice == '3':
            search_item(inventory)
        elif choice == '0':
            print("\nExiting program. Goodbye!")
            break
        else:
            print("\n[Error] Invalid choice. Please try again.")

if ___name___ == "___main___":
    main()