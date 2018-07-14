import {elements} from './base';
import {limitRecipeTitleChar} from './searchView'

export function toggleLikesButton(isLiked) {
    const attr = isLiked ? 'img/icons.svg#icon-heart' : 'img/icons.svg#icon-heart-outlined';
    document.querySelector('.header__likes use').setAttribute('href', attr);
}

export function toggleLikesMenu(likesListSize) {
    elements.likesField.style.visibility = (likesListSize > 0) ? 'visible' : 'hidden';
}

export function renderLike(like) {
    const template = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="Test">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitleChar(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', template);
}

export function removeLike(id) {
    const like = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;

    if(like) {
        like.parentElement.removeChild(like);
    }
}