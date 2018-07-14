export const elements = {
    searchForm  : document.querySelector('.search'),
    searchField : document.querySelector('.search__field'),
    results     : document.querySelector('.results'),
    resultsList : document.querySelector('.results__list'),
    resultsPages: document.querySelector('.results__pages'),
    recipe      : document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesField  : document.querySelector('.likes__field'),
    likesList   : document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader'
}

export function renderLoader(parentElement) {

    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw">
            </svg>
        </div>
    `;

    parentElement.insertAdjacentHTML('afterbegin', loader);
};

export function clearLoader() {
    const loader = document.querySelector(`.${elementStrings.loader}`);

    if(loader) {
        loader.parentElement.removeChild(loader);
    }
}