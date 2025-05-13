export class Repository<T extends { id: number }> {
    private items: T[] = [];
    private nextId: number = 1;
  
    add(itemData: Omit<T, 'id'> & { id?: number }): T {
      if (itemData.id && itemData.id >= this.nextId) {
          this.nextId = itemData.id + 1;
      }
      const newItem = { ...itemData, id: itemData.id ?? this.nextId++ } as T;
      this.items.push(newItem);
      console.log(`SYSTEM: Added ${newItem.constructor.name || 'item'} with ID ${newItem.id}`);
      return newItem;
    }
  
    getAll(): T[] {
      return [...this.items];
    }
  
    findById(id: number): T | null {
      const found = this.items.find(item => item.id === id);
      return found ?? null;
    }
  
    update(id: number, updatedItemData: Partial<Omit<T, 'id'>>): T | null {
      const itemIndex = this.items.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        const currentItem = this.items[itemIndex];
        this.items[itemIndex] = { ...currentItem, ...updatedItemData };
        console.log(`SYSTEM: Updated ${currentItem.constructor.name || 'item'} with ID ${id}`);
        return this.items[itemIndex];
      }
      console.log(`SYSTEM: Failed to find ${ (updatedItemData as any)?.constructor?.name || 'item'} with ID ${id} for update`);
      return null;
    }
  

    delete(id: number): boolean {
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