import { LightningElement, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getContacts from '@salesforce/apex/contactDataController.getContacts';
import deleteContacts from '@salesforce/apex/contactDataController.deleteContacts';
import updateContacts from '@salesforce/apex/contactDataController.updateContacts';
import createContacts from '@salesforce/apex/contactDataController.createContacts';

export default class Table extends LightningElement {
    
    @track displayModal = false;
    @track modalMode = '';
    data = [];
    columns = [];
    actions = [];
    rowFields={}; //para guardar la informacion de la fila que se clickeo
    cardTitle;
    buttonTitle;
    lstContacts;

    // data = [
    //     {
    //         id: "001",
    //         firstName: "Pedro",
    //         lastName: "Páramo",
    //         email: "q@q.com",
    //     },
    //     {
    //         id: "002",
    //         firstName: "Juan",
    //         lastName: "Rulfo",
    //         email: "assa@ss.com",
    //     },
    // ];

    actions = [
        {
            label: "Show Details",
            name: "showDetails",
        },
        {
            label: "Delete",
            name: "delete",
        },
    ];

    columns = [
        {
            label: "ID",
            fieldName: "Id",
        },
        {
            label: "First Name",
            fieldName: "FirstName",
        },
        {
            label: "Last Name",
            fieldName: "LastName",
        },
        {
            label: "Email",
            fieldName: "Email",
        },
        {
            type: "action",
            typeAttributes: {
                rowActions: this.actions,
            },
        },
    ];

    async connectedCallback() {
        try {
            await this.obtainContacts();
        } catch (error) {
            console.error(error);

        }
    }

    async obtainContacts() {
        try {
            const contacts = await getContacts();
            this.lstContacts = contacts;
        } catch (error) {
            console.error(error);
        }
    }

    closeModal(){
        this.displayModal = false;
    }

    handleRowActions(event) {
        const actionName = event.detail.action.name;
        this.rowFields = event.detail.row;
        this.displayModal = true;

        switch (actionName) {
            case 'showDetails':
                this.cardTitle = 'Edit Contact';
                this.buttonTitle = 'Save';
                this.modalMode = 'edit';
                console.log('clicked details');
                break;

            case 'delete':
                this.cardTitle = 'Are you sure?';
                this.buttonTitle = 'Delete';
                this.modalMode = 'delete';
                console.log('clicked delete');
                break;
        }
    };

    handleCardBtn(){
        this.cardTitle = 'New Contact';
        this.buttonTitle = 'Create';
        this.modalMode = 'create';
        this.displayModal = true;
        console.log('clicked new contact');
    }

    handleCancelBtnModal(){
        this.closeModal();
        console.log('cancel handled');
    }

    async handleConfirmBtnModal(modalEvent) {
        const modeName = modalEvent.detail.mode;
        switch (modeName) {
            case 'edit':
                try{
                    const updatedData = modalEvent.detail.data;
                    await updateContacts({
                        contactId: updatedData.Id,
                        firstName: updatedData.FirstName,
                        lastName: updatedData.LastName,
                        email: updatedData.Email
                    });
                    this.showToast('Updated', 'Contact updated successfully.', 'success', 'dismisable');

                    // Reload contacts
                    await this.obtainContacts();
                    console.log('edit handled');
                } catch (error) {
                    console.error('Error updating contact:', error);
                    this.showToast('Error', 'Error updating contact.', 'error', 'dismisable');
                }
                break;
            case 'create':
                try {
                    const newData = modalEvent.detail.data;
                    console.log('createee: ', newData);

                    await createContacts({
                        firstName: newData.FirstName,
                        lastName: newData.LastName,
                        email: newData.Email
                    });
                    this.showToast('Created', 'Contact created successfully.', 'success', 'dismisable');

                    // Reload contacts
                    await this.obtainContacts();
                    console.log('create handled');

                    
                } catch (error) {
                    console.error('Error creating contact:', error);
                    this.showToast('Error', 'Error creating contact.', 'error', 'dismisable');
                }
                break;
            case 'delete':
                try {
                    const idSelected = this.rowFields.Id
                    console.log(idSelected);
                    await deleteContacts({ id: idSelected });
                    this.showToast('Deleted', 'Contact deleted successfully.', 'success', 'dismisable');

                    // Reload contacts
                    await this.obtainContacts();
                } catch (error) {
                    console.error('Error deleting contact:', error);
                    this.showToast('Error', 'Error deleting contact.', 'error', 'dismisable');
                }
                break;
            default:
                console.error('Invalid action');
        }
        this.closeModal();
    }


    showToast(title, message, variant, mode){
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode,
        });
        this.dispatchEvent(event);
    }
}