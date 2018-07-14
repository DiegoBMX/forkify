import {elements} from './base';

export function getQueryInput() {
    return elements.searchField.value;
};

export function clearInputField() {
    elements.searchField.value = '';
};

export function highlightSelected(id) {

    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    resultsArray.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

/**
 * results: array of recipe objects
 * page: number of the recipe page to display
 * recipesPerPage: quantity of recipes to display in each page
 */

export function displayRecipeResults(results, page=1, recipesPerPage=10) {

    let start = (page - 1) * recipesPerPage,
        end   = page * recipesPerPage;

    const recipesToDisplay = results.slice(start, end);

    recipesToDisplay.forEach(renderRecipe);
    renderButtons(page, results.length, recipesPerPage);
};

function renderRecipe(recipe) {

    const template = `
            <li>
                <a class="results__link" href="#${recipe.recipe_id}">
                    <figure class="results__fig">
                        <img src="${recipe.image_url}" alt="${recipe.title}">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${limitRecipeTitleChar(recipe.title)}</h4>
                        <p class="results__author">${recipe.publisher}</p>
                    </div>
                </a>
            </li>
        `;

        elements.resultsList.insertAdjacentHTML('beforeend', template);
};

function renderButtons(page, numOfResults, resultsPerPage) {
    const pages = Math.ceil(numOfResults / resultsPerPage);

    let button;
    if(page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if(page < pages) {
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `
    } else if(page === pages && pages > 1) {
        button = createButton(page, 'prev');
    };

    elements.resultsPages.insertAdjacentHTML('afterbegin', button);
};

function createButton(page, type) {

    return `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'next' ? page + 1 : page - 1}>
        <span>Page ${type === 'next' ? page + 1 : page - 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>
    </button>
    `; 
};

export function limitRecipeTitleChar(title, limit=17) {

    if(title.length > limit) {
        const limitTitleArray = [];

        title
            .split(' ')
            .reduce((acc, word) => {
                if(acc + word.length <= limit) {
                    limitTitleArray.push(word);
                }
                return acc += word.length;
            }, 0);

        return limitTitleArray.join(' ') + '...';  
    }

    return title;
};

export function clearResultsList() {
    elements.resultsList.innerHTML  = '';
    elements.resultsPages.innerHTML = '';
};