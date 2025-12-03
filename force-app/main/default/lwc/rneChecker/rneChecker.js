import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkPhoneNumber from '@salesforce/apex/RNEQueryManager.createQuery';
import checkEmail from '@salesforce/apex/RNEQueryManager.createEmailQuery';
export default class RneChecker extends LightningElement {
    

    // ========================================
    // PROPIEDADES
    // ========================================
    @api recordId;           // ID del registro actual (Lead/Contact/Account)
    @api objectApiName;      // Nombre del objeto actual
    
    @track phoneNumber = ''; // Número a consultar
    @track email = '';       // Email a consultar
    @track isLoading = false; // Estado de carga
    @track phoneResult = null; // Resultado teléfono
    @track emailResult = null; // Resultado email
    @track showResults = false; // Mostrar tabla de resultados
    
    // ========================================
    // MANEJADORES DE EVENTOS
    // ========================================
    
    /**
     * Captura cambios en el input de teléfono
     */
    handlePhoneChange(event) {
        this.phoneNumber = event.target.value;
    }
    
    /**
     * Captura cambios en el input de email
     */
    handleEmailChange(event) {
        this.email = event.target.value;
    }
    
    /**
     * Ejecuta la consulta cuando se hace clic en el botón
     */
    async handleCheck() {
        // Validar que se ingresó al menos un dato
        if(!this.phoneNumber && !this.email) {
            this.showToast('Error', 'Ingrese al menos un número telefónico o correo electrónico', 'error');
            return;
        }
        
        this.isLoading = true;
        this.showResults = false;
        
        try {
            // ====================================
            // CONSULTAR TELÉFONO SI EXISTE
            // ====================================
            if(this.phoneNumber) {
                try {
                    const phoneQueryResult = await checkPhoneNumber({
                        phoneNumber: this.phoneNumber,
                        relatedObjectType: this.objectApiName,
                        relatedObjectId: this.recordId
                    });
                    
                    // Formatear resultado del teléfono
                    this.phoneResult = {
                        type: 'Móvil',
                        value: this.phoneNumber,
                        canReceiveSMS: phoneQueryResult.Is_Excluded__c ? 'No recibir' : 'Recibir',
                        canReceiveCalls: phoneQueryResult.Is_Excluded__c ? 'No recibir llamadas' : 'Recibir llamadas',
                        applications: phoneQueryResult.Is_Excluded__c ? 'No recibir' : 'Recibir',
                        creationDate: this.formatDateTime(phoneQueryResult.Query_Date__c),
                        exists: true,
                        isExcluded: phoneQueryResult.Is_Excluded__c
                    };
                    
                } catch(error) {
                    // Si hay error, marcar como no encontrado
                    this.phoneResult = {
                        type: 'Móvil',
                        value: this.phoneNumber,
                        exists: false,
                        message: 'No se encontró el registro'
                    };
                }
            }
            
            // ====================================
            // CONSULTAR EMAIL SI EXISTE
            // ====================================
            if(this.email) {
                try {
                    const emailQueryResult = await checkEmail({
                        email: this.email,
                        relatedObjectType: this.objectApiName,
                        relatedObjectId: this.recordId
                    });
                    
                    // Formatear resultado del email
                    this.emailResult = {
                        type: 'Correo',
                        value: this.email,
                        canReceiveSMS: 'N/A',
                        canReceiveCalls: 'N/A',
                        applications: emailQueryResult.Is_Excluded__c ? 'No recibir' : 'Recibir',
                        creationDate: this.formatDateTime(emailQueryResult.Query_Date__c),
                        exists: true,
                        isExcluded: emailQueryResult.Is_Excluded__c
                    };
                    
                } catch(error) {
                    // Si hay error, marcar como no encontrado
                    this.emailResult = {
                        type: 'Correo',
                        value: this.email,
                        exists: false,
                        message: 'No se encontró el registro'
                    };
                }
            }
            
            this.showResults = true;
            
        } catch(error) {
            this.showToast('Error', 'Error al consultar: ' + error.body?.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }
    
    // ========================================
    // MÉTODOS AUXILIARES
    // ========================================
    
    /**
     * Formatea fecha y hora al formato colombiano
     */
    formatDateTime(dateTimeString) {
        if(!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }
    
    /**
     * Muestra notificación toast
     */
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ 
            title, 
            message, 
            variant 
        }));
    }
    
    // ========================================
    // GETTERS COMPUTADOS
    // ========================================
    
    /**
     * Verifica si hay resultados para mostrar
     */
    get hasResults() {
        return this.showResults && (this.phoneResult || this.emailResult);
    }
    
    /**
     * Datos para la tabla
     */
    get tableData() {
        const data = [];
        if(this.phoneResult) data.push(this.phoneResult);
        if(this.emailResult) data.push(this.emailResult);
        return data;
    }
    
    /**
     * Resultados que fueron encontrados
     */
    get resultsForDisplay() {
        return this.tableData.filter(r => r.exists);
    }
    
    /**
     * Resultados que NO fueron encontrados
     */
    get notFoundResults() {
        return this.tableData.filter(r => !r.exists);
    }
    
    /**
     * Verifica si hay resultados encontrados
     */
    get hasFoundResults() {
        return this.resultsForDisplay.length > 0;
    }
    
    /**
     * Verifica si hay resultados NO encontrados
     */
    get hasNotFoundResults() {
        return this.notFoundResults.length > 0;
    }
}