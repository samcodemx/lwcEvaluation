import { LightningElement, api } from 'lwc';

export default class Form extends LightningElement {
    @api mode;
    @api cardTitle;
    @api buttonTitle;
    @api columns;
    @api rowFields;
    fieldValues=[]; 

    get isEditMode() {
        return this.mode === 'edit';
    }

    get isCreateMode() {
        return this.mode === 'create';
    }

    get isDeleteMode() {
        return this.mode === 'delete';
    }


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

    handleFieldChange(event){
        const fieldName = event.target.dataset.id;
        const fieldValue = event.target.value;
        const rowFields = {...this.rowFields};
        rowFields[fieldName] = fieldValue;
        this.rowFields = rowFields;
    };

    handleConfirmBtn() {
        const dataToSend = this.rowFields;
        const mode = this.mode;
        const event = new CustomEvent('confirm', {
            detail: {
                data: dataToSend,
                mode: mode,
            }
        });
        this.dispatchEvent(event);
        console.log('confirm button clicked from form');
    }
}
