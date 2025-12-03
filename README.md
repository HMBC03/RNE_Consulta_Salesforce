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

1. **Frontend (LWC):** Manejo de estado, validación de inputs y presentación dinámica de resultados.
2. **Backend (Apex Controller):**
   - `RNEController.cls`: Actúa como middleware seguro.
   - Uso de **DTOs (Data Transfer Objects)** para estructurar la respuesta JSON compleja de la API en un objeto manejable por el componente.
   - **Named Credentials / Custom Labels**: Manejo seguro del Token de autenticación.

## ⚙️ Instalación y Configuración

Para desplegar este proyecto en tu propia Org de Salesforce:

### 1. Despliegue del Código

Despliega los archivos fuente a tu organización usando Salesforce CLI:

```bash
sf project deploy start --source-dir force-app
```

### 2. Configuración de Seguridad (Importante)

Para que la integración funcione, debes configurar lo siguiente en tu Org:

**Remote Site Setting:**
- Ve a **Setup > Security > Remote Site Settings**.
- Agrega una nueva entrada con la URL: `https://tramitescrcom.gov.co`

**Token de Autenticación:**
- Este proyecto usa una Custom Label para almacenar el token de la API.
- Ve a **Setup > User Interface > Custom Labels**.
- Crea una etiqueta llamada `RNE_Auth_Token`.
- Valor: `Tu_Token_De_La_CRC_Aquí`.

### 3. Agregar a la Página

Edita cualquier página de registro (Record Page) o App Page en el Lightning App Builder y arrastra el componente `micomponente` (o el nombre que le hayas dado) al lienzo.

## 📸 Capturas de Pantalla

_(Te recomiendo subir una imagen de tu componente aquí)_

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