import { LightningElement , api } from 'lwc';

export default class MovieTile extends LightningElement {
    @api movie;
    @api selectedMovieId;
    clickHandler(){
        console.log('the movie is ',this.movie.imdbID);
        console.log('the selected movieId', this.selectedMovieId);
        const ev= new CustomEvent("selectedmovie",{
            detail : this.movie.imdbID
        });
        this.dispatchEvent(ev);
    }
    get tileSelected(){
        return this.selectedMovieId === this.movie.imdbID ? "tile selected" : "tile"; // here in tile selected--> both words are two classes and the css is associated with the selected class
    }
}