import { LightningElement } from 'lwc';
export default class CurrencyConvertor extends LightningElement {
    AmountEntered=''
    fromCurrencysymbol =''
    ToCurrencysymbol =''
    currencyOptions=[]
    convertedcurrency =''
    showOutput=false
    connectedCallback(){
        this.fetchSymbol()
    }
    AmountHandler(event){
        this.AmountEntered = event.target.value;
    }
    FromHandler(event){
        this.fromCurrencysymbol = event.target.value;
    }
    ToHandler(event){
        this.ToCurrencysymbol =event.target.value;
    }
    async fetchSymbol(){
        let url = `https://api.frankfurter.app/currencies`;
        try {
            let resp= await fetch(url);
            if(!resp.ok){
                throw new error('the response is not the desired one');
            }
            const data = await resp.json();
            let options=[];
            for(let i in data){
                options =[...options, {label:i,value:i}]
            }
            this.currencyOptions= [...options];
            
        } catch (error) {
            console.log("the error is ", error);
            
        }
    }
    convertHandler(){
        this.conversions();
    }
    async conversions(){
        console.log('the amount is ', this.AmountEntered ,' the from currency is ',this.fromCurrencysymbol, ' the to currency is ' , this.ToCurrencysymbol)
        let url=`https://api.frankfurter.app/latest?amount=${this.AmountEntered}&from=${this.fromCurrencysymbol}&to=${this.ToCurrencysymbol}`; 
    try {
        let resp = await fetch(url);
        console.log('the response iis', resp);
        if (!resp.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await resp.json();
        this.convertedcurrency = data.rates[this.ToCurrencysymbol];
        console.log('the converted currency is ' + this.convertedcurrency);
        this.showOutput = true;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
}