import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {
    
    @api mode;
    @api cardTitle;
    @api buttonTitle;
    @api columns;
    @api rowFields;
    fieldValues=[]; //almacena la data que se va a pasar al modal desde la columna clickeada

    connectedCallback(){
        for (const column of this.columns){
            if(column.fieldName !== 'Id' && column.type !== 'action'){
                this.fieldValues.push({
                    ...column,
                    value:this.rowFields[column.fieldName]
                })
            }
        }
    }

    get isEditMode() {
        return this.mode === 'edit';
    }

    get isCreateMode() {
        return this.mode === 'create';
    }

    get isDeleteMode() {
        return this.mode === 'delete';
    }

    handleCancelBtn(){
        const event = new CustomEvent('cancel');
        this.dispatchEvent(event);
        console.log('cancel button clicked from modal')
    }

    handleConfirmBtn(){
        const dataToSend = this.rowFields;
        const mode = this.mode
        const event = new CustomEvent('confirm', {
            detail: {
                data: dataToSend,
                mode: mode,
            }
        });
        this.dispatchEvent(event);
        console.log('event:', event.detail.mode)
        console.log('confirm button clicked from modal')
    };

    handleFieldChange(event){
        const fieldName = event.target.dataset.id;
        const fieldValue = event.target.value;
        const rowFields = {...this.rowFields};
        rowFields[fieldName] = fieldValue;
        this.rowFields = rowFields;
    };
}