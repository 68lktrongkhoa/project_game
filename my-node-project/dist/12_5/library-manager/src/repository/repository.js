"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
class Repository {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }
    add(itemData) {
        if (itemData.id && itemData.id >= this.nextId) {
            this.nextId = itemData.id + 1;
        }
        const newItem = { ...itemData, id: itemData.id ?? this.nextId++ };
        this.items.push(newItem);
        console.log(`SYSTEM: Added ${newItem.constructor.name || 'item'} with ID ${newItem.id}`);
        return newItem;
    }
    getAll() {
        return [...this.items];
    }
    findById(id) {
        const found = this.items.find(item => item.id === id);
        return found ?? null;
    }
    update(id, updatedItemData) {
        const itemIndex = this.items.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            const currentItem = this.items[itemIndex];
            this.items[itemIndex] = { ...currentItem, ...updatedItemData };
            console.log(`SYSTEM: Updated ${currentItem.constructor.name || 'item'} with ID ${id}`);
            return this.items[itemIndex];
        }
        console.log(`SYSTEM: Failed to find ${updatedItemData?.constructor?.name || 'item'} with ID ${id} for update`);
        return null;
    }
    delete(id) {
        const itemIndex = this.items.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            this.items.splice(itemIndex, 1);
            console.log(`SYSTEM: Deleted item with ID ${id}`);
            return true;
        }
        console.log(`SYSTEM: Failed to find item with ID ${id} for deletion`);
        return false;
    }
}
exports.Repository = Repository;
