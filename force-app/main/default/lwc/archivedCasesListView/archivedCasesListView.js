import { LightningElement, wire, api } from 'lwc';
import getArchivedCases from '@salesforce/apex/archiveController.getArchivedCases';
import getArchivedCase from '@salesforce/apex/archiveController.getArchivedCase';
import { getRecord } from 'lightning/uiRecordApi';

const columns = [
    {
        label: '',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'action:preview',
            title: 'Preview',
            variant: 'border-filled',
            alternativeText: 'View'
        }
    },    
    { label: 'Subject', fieldName: 'Subject__c', type: 'text'},
    { label: 'Account', fieldName: 'Account_Name__c', type: 'text'},
    { label: 'Contact', fieldName: 'Contact_Name__c', type: 'text'},
    { label: 'Type', fieldName: 'Type__c', type: 'text'},
    { label: 'Closed Date', fieldName: 'ClosedDate__c', type: 'date'}
];

export default class ArchiveCaseListView extends LightningElement {
    @api recordId;
    @api mode;
    columns = columns;
    archivedCases;
    archivedCase;
    rowOffset = 0;
    showModal = false;
    accountId = '';
    contactId = '';
    
    connectedCallback() {
        console.log('connectedCallback: ' + this.mode);
        switch(this.mode) {
            case 'All Archived Cases':
                this.getArchivedCases();
                break;
            case 'Archived Cases for Current Account':
                this.getArchivedCasesForAccountRecord();
                break;
            case 'Archived Cases for Current Contact':
                this.getArchivedCasesForContactRecord();
                break;
        }
    }

    getArchivedCases() {
        console.log('getArchivedCases');

        getArchivedCases({
            accountId: this.accountId,
            contactId: this.contactId
        })
        .then(result => {
            console.log('Result: ' + JSON.stringify(result));
            this.archivedCases = result;
        })
        .catch(error => {
            console.log('ERROR: ' + JSON.stringify(error));
        });
    }

    getArchivedCasesForAccountRecord() {
        console.log('getArchivedCasesForAccountRecord: ' + this.recordId);
        this.accountId = this.recordId;
        this.getArchivedCases();
    }

    getArchivedCasesForContactRecord() {
        console.log('getArchivedCasesForContactRecord: ' + this.recordId);
        this.contactId = this.recordId; 
        this.getArchivedCases();
    }

    handleRowAction(event) {
        console.log('handleRowAction');

        getArchivedCase({
            accountId: event.detail.row.Account_Id__c,
            contactId: event.detail.row.Contact_Id__c,
            recordId: event.detail.row.Record_Id__c
        })
        .then(result => {
            console.log('Result: ' + JSON.stringify(result));
            this.archivedCase = result;
            this.showModal = true;
        })
        .catch(error => {
            console.log('ERROR: ' + JSON.stringify(error));
        });
    }

    closeModal() {
        this.showModal = false;
    }

}