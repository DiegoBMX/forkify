import uniqid from 'uniqid';

export default class List {

    constructor() {

        this.items = [];

    }

    addItem(count, unit, ingredient) {

        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        this.items.push(item);
        return item;
    }

    deleteItem(id) {

        const itemIndex = this.items.findIndex( el => el.id === id );
        const item      = this.items.splice(itemIndex, 1);

        return item;
    }

    updateItem(id, newCount) {

        const item = this.items.find( el => el.id === id );
              item.count = newCount;
        
        return item;
    }
}