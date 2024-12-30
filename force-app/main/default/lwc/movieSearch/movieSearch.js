import { LightningElement, wire } from 'lwc';
const DELAY =300;

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import movie_Channel from '@salesforce/messageChannel/movieChannel__c';

export default class MovieSearch extends LightningElement {
    get options(){
        return [
        {label:'None',value :''},
        {label:'Movie',value :'movie'},
        {label:'Series',value :'series'},
        {label:'Episode',value :'episode'}
    ]
}
@wire(MessageContext)messageContext;
    searchedData=[]
    selectedtype="";
    searchTypeResult='';
    enterNumber='';
    loading=false;
    delayTimeOut
    selectedMovie="";
    handleChange(event){  
       // this.type=event.target.value;
       let {name, value}= event.target;
       this.loading = true;
       if(name == 'type'){
        this.selectedtype = value;
        console.log('the value is ', this.selectedtype); 
       }
       else if( name=='moviename'){
        this.searchTypeResult =value;
       }
       else if(name =='pageEntries'){
        this.enterNumber= value;
       }

       // debouncing -- delay the 
       clearTimeout(this.delayTimeOut);
       this.delayTimeOut = setTimeout(() => {
        this.searchMovie();
        }, DELAY);
       
       
    }
    async searchMovie(){
        const url=`https://www.omdbapi.com/?s=${this.searchTypeResult}&type=${this.selectedtype}&page=${this.enterNumber}&apikey=d03aa56a`;
        const responseOut= await fetch(url);
        const data = await responseOut.json();
        console.log('the searched movie is', data);
        this.loading = false;
        if(data.Response == 'True'){
           
            this.searchedData = data.Search;
            console.log('the length is '+ this.searchedData.length);
        }
    }
    movieSelectedHandler(event){
        this.selectedMovie= event.detail;
        const payload = { movieId:  this.selectedMovie };

        publish(this.messageContext, movie_Channel, payload);
        console.log('the name is ', this.selectedMovie);
    } 
    get displaySearchResult()
    {
        return this.searchedData.length>0?true:false;
    }
    
}
    