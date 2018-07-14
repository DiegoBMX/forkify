import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';

/**  Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

/**
 * SEARCH CONTROLLER
 */

elements.searchForm.addEventListener('submit', e => {

    e.preventDefault();
    controlSearch();
});

elements.resultsPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResultsList();
        searchView.displayRecipeResults(state.search.results, goToPage);
    }
});

async function controlSearch() {

    // Get query string from view
    const query = searchView.getQueryInput();

    if(query) {
        // Set search state
        state.search = new Search(query);

        // Prepare UI for display
        searchView.clearInputField();
        searchView.clearResultsList();
        renderLoader(elements.results);

        // Get recipes (API call)
        await state.search.getRecipes();

        // Display recipes on UI
        clearLoader();
        searchView.displayRecipeResults(state.search.results);
    }
}

/**
 * RECIPE CONTROLLER
 */
state.likes = new Likes();
likesView.toggleLikesMenu(state.likes.getNumLikes());

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe)); 

async function controlRecipe() {

    const id = window.location.hash.replace('#', '');
    
    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected recipe
        if(state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        // Get recipe data and parse ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        // Calculate servings and time to cook
        state.recipe.calcTime();
        state.recipe.calcServings();

        // Display recipe on UI
        clearLoader();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    }
};

/**
 * LIST CONTROLLER
 */

 function controlList() {
    
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(ing => {
        const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
        listView.renderItem(item)
    });
 };

// Handle delete and update items from shopping list events
elements.shoppingList.addEventListener('click', e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if(e.target.matches('.shopping__count-value')) {
        const value = parseFloat(e.target.value, 10);
        state.list.updateItem(id, value);
    }
});

/**
 * LIKES CONTROLLER
 */


function controlLikes() {
    if(!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;
    if(!state.likes.isLiked(currentId)) {
        // Add like to the state list of likes
        const like = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );

        // Toggle button on UI
        likesView.toggleLikesButton(true);

        // Add to UI list
        likesView.renderLike(like);
    } else {
        // Remove like from the state list of likes
        const deletedLike = state.likes.deleteLike(currentId);
        console.log(deletedLike);
        // Toggle button on UI
        likesView.toggleLikesButton(false);

        // Remove from UI list
        likesView.removeLike(currentId);
    }

    likesView.toggleLikesMenu(state.likes.getNumLikes());
}

window.addEventListener('load', (e) => {
    state.likes = new Likes();
    state.likes.getPersistentLikesData();
    likesView.toggleLikesMenu(state.likes.getNumLikes());

    state.likes.likes.forEach(like => {
        likesView.renderLike(like);
    });
});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {

    if(e.target.matches('.btn-decrease, .btn-decrease *')) {

        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }

});

