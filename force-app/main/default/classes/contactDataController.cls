public with sharing class contactDataController {
    @AuraEnabled
    public static Contact[] getContacts(){
        try {
            Contact[] lstContacts = [SELECT Id, FirstName, LastName, Email FROM Contact LIMIT 10];
            return(lstContacts);
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw e;
        }
    }

    @AuraEnabled
    public static void createContacts(String firstName, String lastName, String email){
        try {
            Contact newContact = new Contact();
            newContact.FirstName = firstName;
            newContact.LastName = lastName;
            newContact.Email = email;
            insert newContact;

            //System.debug('Contacto creado: ' + newContact);    

        } catch (Exception e) {
            System.debug(e.getMessage());
            throw e;
        }
    }

    @AuraEnabled
    public static void updateContacts(String contactId, String firstName, String lastName, String email){
        try {
            Contact contactToUpdate = [SELECT Id, FirstName, LastName, Email FROM Contact WHERE Id = :contactId LIMIT 1];
            
            contactToUpdate.FirstName = firstName;
            contactToUpdate.LastName = lastName;
            contactToUpdate.Email = email;
            update contactToUpdate;

            // System.debug('Contacto actualizado: ' + contactToUpdate);    
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw e;
        }
    }

    @AuraEnabled
    public static void deleteContacts(String id){
        try {
            Contact contactToDelete = [SELECT Id FROM Contact WHERE Id = :id LIMIT 1];
            delete contactToDelete;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw e;
        }
    }
    

}