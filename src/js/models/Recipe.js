import axios from 'axios';
import {proxy, key} from '../config';

export default class Recipe {

    constructor(id) {
        this.id = id;
    }

    async getRecipe() {

        try {

            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);

            this.title       = res.data.recipe.title;
            this.author      = res.data.recipe.publisher;
            this.image       = res.data.recipe.image_url;
            this.url         = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            
        } catch(err) {
            console.log(err);
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);

        this.time = period * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(el => {
            el.count *= (newServings / this.servings);
        });
    
        this.servings = newServings;
    }

    parseIngredients() {

        const unitsLong  = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'pounds', 'cups'];
        const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'pound', 'cup'];
        const units      = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map((ing) => {
            // Uniform units
            let ingredient = ing.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove paranthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // Parse ingredient into count, unit and ingredient
            const arrIng    = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el => units.includes(el));

            let objIng;
            if(unitIndex > -1) {
                // There is unit
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if(parseInt(arrIng[0], 10)) {
                // No unit but there is quantity
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if(unitIndex === -1) {
                // No unit nor quantity
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }
}