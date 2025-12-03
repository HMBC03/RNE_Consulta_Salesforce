import { LightningElement, track } from 'lwc';
import consultarRNE from '@salesforce/apex/RNEController.consultarRNE';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Micomponente extends LightningElement {
    @track email = '';
    @track phoneNumber = '';
    @track isLoading = false;
    @track queryResult = null;
    @track contactDetails = []; // Nueva lista para las cajitas de colores

    // Diccionario para traducir las llaves del API a Español
    labelsMap = {
        'sms': 'Mensajería SMS',
        'aplicacion': 'Apps (WhatsApp)',
        'llamada': 'Llamada de Voz',
        'correo_electronico': 'Correo Electrónico'
    };

    handleEmailChange(event) {
        this.email = event.target.value;
        this.phoneNumber = '';
        this.queryResult = null;
        this.contactDetails = [];
    }

    handlePhoneChange(event) {
        this.phoneNumber = event.target.value;
        this.email = '';
        this.queryResult = null;
        this.contactDetails = [];
    }

    async handleCheck() {
        const valorABuscar = this.phoneNumber ? this.phoneNumber : this.email;
        const tipoBusqueda = this.phoneNumber ? 'TELEFONO' : 'EMAIL';

        if (!valorABuscar) {
            this.showToast('Atención', 'Ingresa un dato para consultar', 'warning');
            return;
        }

        this.isLoading = true;
        this.contactDetails = []; // Limpiar anteriores

        try {
            const result = await consultarRNE({ dato: valorABuscar, tipo: tipoBusqueda });

            // 1. Manejo del mensaje principal
            this.queryResult = {
                Response_Message__c: result.message,
                Query_Date__c: new Date().toLocaleString('es-CO'),
                Is_Excluded__c: result.found
            };

            // 2. PROCESAR LAS OPCIONES DETALLADAS (Aquí está la magia)
            if (result.contactOptions) {
                let detalles = [];
                
                // Recorremos el mapa que viene de Apex: { sms: true, llamada: false ... }
                for (const [key, value] of Object.entries(result.contactOptions)) {
                    
                    // Definimos lógica: Según tu ejemplo, TRUE es habilitado, FALSE es bloqueado.
                    let isAllowed = value === true; 

                    detalles.push({
                        key: key,
                        label: this.labelsMap[key] || key.toUpperCase(), // Usar nombre bonito o la llave original
                        value: value,
                        // Configuración visual dinámica
                        statusText: isAllowed ? 'PERMITIDO' : 'RESTRINGIDO',
                        iconName: isAllowed ? 'utility:check' : 'utility:close',
                        boxClass: isAllowed 
                            ? 'slds-box slds-box_x-small slds-theme_success slds-text-align_center slds-text-color_inverse' 
                            : 'slds-box slds-box_x-small slds-theme_error slds-text-align_center slds-text-color_inverse'
                    });
                }
                this.contactDetails = detalles;
            }

            // Notificación (Toast)
            if (result.found) {
                this.showToast('Registro Encontrado', 'El contacto existe en la base de datos.', 'info');
            } else {
                this.showToast('No Encontrado', 'El contacto no aparece en la lista de excluidos.', 'success');
            }

        } catch (error) {
            this.showToast('Error', 'Error al consultar: ' + (error.body?.message || error.message), 'error');
            this.queryResult = null;
        } finally {
            this.isLoading = false;
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}