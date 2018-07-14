import axios from 'axios';
import {proxy, key} from '../config';

export default class Search {

    constructor(query) {
        this.query = query;
    }

    async getRecipes() {

        try {
            const results = await axios.get(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.results  = results.data.recipes;
        } catch(err) {
            console.log(err);
        }
    }
}