export default class Likes {

    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);

        this.persistData();
        return like;
    }

    deleteLike(id) {
        const likeIndex = this.likes.findIndex( el => el.id === id );
        const like      = this.likes.splice(likeIndex, 1);

        this.persistData();
        return like;
    }

    isLiked(id) {
        return (this.likes.findIndex((like) => like.id === id) !== -1);
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    getPersistentLikesData() {
        const likes = JSON.parse(localStorage.getItem('likes'));
        
        if(likes) {
            this.likes = likes;
        }
    }
}