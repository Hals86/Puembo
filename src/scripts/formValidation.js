import { sendWhatsAppMessage } from './whatsappHandler.js';

export function initFormValidation() {
    const form = document.querySelector("form");
    if (!form) return;

    // Protection variables
    let isSubmitting = false;
    const submitBtn = form.querySelector('button[type="submit"]');

    // DEBUG MODE - Set to false in production
    const DEBUG_MODE = false;

    form.addEventListener("submit", (e) => {
        // Stop default immediately to control the flow
        e.preventDefault();

        if (isSubmitting) return;

        const budgetSelect = document.getElementById("budget");
        const companyInput = document.getElementById("company");
        const businessInput = document.getElementById("business_type");
        const whatsappInput = document.getElementById("whatsapp");

        if (!budgetSelect || !companyInput || !businessInput || !whatsappInput) {
            return;
        }

        const whatsapp = whatsappInput.value.trim();

        // 🕵️ Manual check for Ecuadorian mobile prefix (Priority check)
        if (!whatsapp.startsWith("09")) {
            alert("El número de contacto debe empezar con 09.");
            whatsappInput.focus();
            return;
        }

        // Check browser validation (required, length, pattern)
        if (!form.reportValidity()) {
            return;
        }

        const budget = budgetSelect.value;
        const company = companyInput.value.trim();
        const businessType = businessInput.value;

        // 🕵️ Manual check for select placeholders (extra safety)
        if (!businessType || businessType === "") {
            alert("Por favor, seleccione un giro de negocio.");
            businessInput.focus();
            return;
        }

        // 👮 Security Check: Anti-XSS and Strict Character Validation
        // This pattern blocks potential scripts and excessive special characters
        const scriptPattern = /<script\b[^>]*>([\s\S]*?)<\/script>|on\w+\s*=|javascript:/gi;
        const suspiciousChars = /[<>"{}[\]\\^`|]/g; // Block common XSS chars

        // Validate all textual inputs for security
        const textualInputs = [
            { field: company, element: companyInput },
            { field: whatsapp, element: whatsappInput }
        ];

        for (const input of textualInputs) {
            if (scriptPattern.test(input.field) || suspiciousChars.test(input.field)) {
                alert("El contenido ingresado contiene caracteres no permitidos por seguridad.");
                input.element.focus();
                return;
            }
        }

        // 👮 Double Check: Ensure values are not empty
        if (!company || !whatsapp || !budget) {
            alert("Por favor, complete todos los campos requeridos.");
            return;
        }

        // Visual feedback
        isSubmitting = true;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
        }

        // Debugging
        if (DEBUG_MODE) {
            console.group('🧪 Form Submission Test');
            console.log('📝 Data:', { company, businessType, budget, whatsapp });
            console.log('💰 Budget Constraint:', budget.toLowerCase().includes("menor a") ? 'BLOCKED' : 'ALLOWED');
            console.groupEnd();
        }

        // Check budget constraint
        if (budget.toLowerCase().includes("menor a")) {
            alert("Gracias por tu interés, te informaremos cuando tengamos un espacio acorde a tu presupuesto.");
            resetSubmission();
            return;
        }

        const data = {
            company,
            businessType,
            budget,
            whatsapp
        };

        // 📊 Log to Google Sheets (Non-blocking background call)
        sendToGoogleSheets(data);

        // Construct & Redirect via WhatsApp
        // We do this immediately if budget is OK, avoiding flashing issues
        sendWhatsAppMessage(data);

        // Wait a bit before resetting button state
        setTimeout(() => {
            resetSubmission();
        }, 2000);
    });

    /**
     * Sends form data to Google Sheets via Apps Script Web App
     * Uses FormData and fails silently to avoid blocking UX
     */
    async function sendToGoogleSheets(data) {
        const scriptURL = import.meta.env.PUBLIC_GOOGLE_SHEETS_URL;

        console.log("Sheets URL from env:", scriptURL);

        if (!scriptURL) {
            console.error("Google Sheets URL not found in environment variables.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("company", data.company);
            formData.append("business_type", data.businessType);
            formData.append("budget", data.budget);
            formData.append("whatsapp", data.whatsapp);

            // Using mode: "no-cors" is recommended for Google Apps Script POSTs 
            // to avoid CORS preflight issues while still sending the data.
            await fetch(scriptURL, {
                method: "POST",
                body: formData,
                mode: "no-cors"
            });
        } catch (error) {
            console.error("Error sending to Google Sheets:", error);
        }
    }

    function resetSubmission() {
        isSubmitting = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Agenda tu Visita';
        }
    }
}
