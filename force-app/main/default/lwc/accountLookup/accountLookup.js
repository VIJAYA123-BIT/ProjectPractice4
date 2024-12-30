import { LightningElement , api, wire } from 'lwc';
import fetchLookupData from'@salesforce/apex/customLookupAccountController.fetchLookupData';
const DELAY = 300;
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class AccountLookup extends LightningElement {
    searchKey;
    @api objectApiName ='Account';
    @api label= 'Account'
    @api placeholder ='Search Account';
    @api iconName= 'standard:account'
    hasRecords =false;
    searchOutput=[]
    selectedRecords=[]
    delayTimeout
    @wire (fetchLookupData ,{
        searchKey :"$searchKey" ,
        objectApiName :"$objectApiName"
    }) 
     searchResult({data, error}){
        if(data){
            console.log('the data is ', data)
            this.hasRecords = data.length >0 ? true :false;
            this.searchOutput = data;
        }
        else if (error){
            console.log('the error is ',error);
        }
     }
     inputHandler(event){
        clearTimeout(this.delayTimeout)
        let value =event.target.value;
        this.delayTimeout= setTimeout(() => {
            this.searchKey = value;
        }, DELAY)
     }

     clickHandler(event){
        let recid = event.target.getAttribute('data-recid');
        console.log('the record id is '+ recid);
        if(this.validateDuplicateSelectionRecords(recid)){
            let selectRecord = this.searchOutput.find((item) => item.Id ===recid);
            ;
            //pill is also a standard word search in google for pill container slds 
            let pill= {
                type: 'icon',
                label : selectRecord.Name,
                name: recid,
                iconName :this.iconName,
                alternativeText : selectRecord.Name
            };
            this.selectedRecords =[...this.selectedRecords,pill];
            }
        }
        
        handleItemRemove(event){
         const index= event.detail.index ;
         this.selectedRecords.splice(index,1)      
        }
        get showPillContainer(){
            return this.selectedRecords.length>0 ?true:false;
           
        }
        validateDuplicateSelectionRecords(selectedRecord){
            let isValid= true;
         let isRecordAlreadySelected=   this.selectedRecords.find(i => i.name === selectedRecord )
         if(isRecordAlreadySelected){
            isValid =false;
            this.dispatchEvent(
                new ShowToastEvent ({
                    title : 'Error',
                    message:'pill is Already Selected',
                    variant :'error'
                })
            )
         }
         else{
            isValid=true;
         }
         return isValid;

        }
}