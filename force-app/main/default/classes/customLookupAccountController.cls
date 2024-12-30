public with sharing class customLookupAccountController {
    @AuraEnabled (cacheable=true)
    public static List<sObject>  fetchLookupData(String searchKey, String objectApiName){
        List<sObject> sObjectList = new list<sObject>();
        if(String.isBlank(searchKey)){
            return sObjectList;
        }
        else{
            String key = '%' +searchKey+'%';
            String query = 'Select Id,Name from ' +objectApiName +' where Name like :key order by Name limit 5' ;
            sObjectList =Database.query(query, AccessLevel.USER_MODE);
            return sObjectList;
        }
}}