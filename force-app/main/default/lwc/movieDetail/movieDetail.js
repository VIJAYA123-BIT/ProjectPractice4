import { LightningElement , wire } from 'lwc';

import {subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext} from 'lightning/messageService';
import movie_Channel from '@salesforce/messageChannel/movieChannel__c';

export default class MovieDetail extends LightningElement {
    subscription=null;
    loadComponent=false
    selectedMovieDetails ={};
    @wire(MessageContext) messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                movie_Channel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }
    handleMessage(message) { 
       let movieId = message.movieId;
        console.log('the movieId is', movieId);
        this.fetchSelectedMovieDetail(movieId);
    }


    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
    async fetchSelectedMovieDetail( movieId){
        console.log('the required movie details is ', movieId);
        let url =`https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=d03aa56a`;
        const  res= await fetch(url);
        const data = await res.json();
        this.selectedMovieDetails = data;
        this.loadComponent =true;
        console.log("Movie Details" , data);
    }
}