# Consulta RNE (Registro de Números Excluidos) - Salesforce LWC

Este proyecto es un componente de Salesforce (Lightning Web Component) que permite consultar en tiempo real el estado de un cliente en el Registro de Números Excluidos (RNE) de la CRC (Colombia).

El objetivo es permitir a los agentes de servicio y ventas verificar instantáneamente si tienen permitido contactar a un cliente por SMS, Llamada o Aplicaciones de mensajería, cumpliendo con la normativa legal vigente.

## 🚀 Características

- **Consulta Dual:** Permite búsqueda por número telefónico o correo electrónico.
- **Integración API REST:** Conexión directa con el servicio web de la CRC.
- **Feedback Visual:** Indicadores claros (Verde/Rojo) para cada canal de contacto (SMS, Voz, Apps).
- **Diseño Responsivo:** Adaptado a la interfaz nativa de Salesforce (Lightning Design System).

## 🛠 Arquitectura Técnica

El proyecto sigue una arquitectura MVC simplificada dentro del ecosistema Salesforce:

<img width="492" height="266" alt="image" src="https://github.com/user-attachments/assets/46138a0a-3c1c-4d69-855a-1c1ceee3e618" />


1. **Frontend (LWC):** Manejo de estado, validación de inputs y presentación dinámica de resultados.
2. **Backend (Apex Controller):**
   - `RNEController.cls`: Actúa como middleware seguro.
   - Uso de **DTOs (Data Transfer Objects)** para estructurar la respuesta JSON compleja de la API en un objeto manejable por el componente.
   - **Named Credentials / Custom Labels**: Manejo seguro del Token de autenticación.
   - Ejemplo de la estructura JSON del API CRC:
     
   


## ⚙️ Instalación y Configuración

Para desplegar este proyecto en tu propia Org de Salesforce:

### 1. Despliegue del Código

Despliega los archivos fuente a tu organización usando Salesforce CLI:

```bash
sf project deploy start --source-dir force-app
```
O con el IDE realizar el deploy

### 2. Configuración de Seguridad (Importante)

Para que la integración funcione, debes configurar lo siguiente en tu Org:

**Remote Site Setting:**
- Ve a **Setup > Security > Remote Site Settings**.
- Agrega una nueva entrada con la URL: `https://tramitescrcom.gov.co`

  <img width="814" height="367" alt="Captura de pantalla 2025-12-02 235112" src="https://github.com/user-attachments/assets/6c9c70f5-fc95-40e1-81b7-65b48d0dc62a" />



**Token de Autenticación:**
- Este proyecto usa una Custom Label para almacenar el token de la API.
- Ve a **Setup > User Interface > Custom Labels**.
- Crea una etiqueta llamada `RNE_Auth_Token`.
- Valor: `Tu_Token_De_La_CRC_Aquí`.

  <img width="875" height="333" alt="Captura de pantalla 2025-12-02 235028" src="https://github.com/user-attachments/assets/4f0d6ae0-11de-4e53-ab82-9147acda5c7f" />


### 3. Agregar a la Página

Edita cualquier página de registro (Record Page) o App Page en el Lightning App Builder y arrastra el componente `micomponente` (o el nombre que le hayas dado) al lienzo.

## 📸 Capturas de Pantalla

Componente resultado de una consulta exitosa:

<img width="508" height="431" alt="Captura de pantalla 2025-12-02 234644" src="https://github.com/user-attachments/assets/90cea372-2310-4a69-b579-3ae5426d785c" />

Resultado cuando no existe o no esta registrado:

<img width="551" height="368" alt="Captura de pantalla 2025-12-02 234820" src="https://github.com/user-attachments/assets/8624e16f-4f25-4f04-8122-bfd4132c0ba6" />


## 📄 Estructura del Proyecto

```
force-app/main/default/
├── classes/
│   ├── RNEController.cls           # Lógica de conexión a la API
│   └── RNEController.cls-meta.xml
├── lwc/
│   └── rneChecker/                 # Componente Web
│       ├── rneChecker.html
│       ├── rneChecker.js
│       └── rneChecker.js-meta.xml
```

## 👨‍💻 Autor

**Héctor Manuel Beltrán Cifuentes**  
Software Developer | Salesforce Developer | Full Stack Junior

Este proyecto es parte de mi portafolio profesional y demuestra capacidades de integración y desarrollo en la plataforma Salesforce.

---

## 📝 Notas Adicionales

- Asegúrate de tener los permisos necesarios en tu Org para realizar callouts a servicios externos.
- El componente está diseñado para ser compatible con Lightning Experience.
- Para soporte o consultas, no dudes en contactarme.
