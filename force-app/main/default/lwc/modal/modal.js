import { LightningElement, api } from 'lwc';

export default class Modal extends LightningElement {
    
    @api mode;
    @api cardTitle;
    @api buttonTitle;
    @api columns;
    @api rowFields;
    fieldValues=[];

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

}