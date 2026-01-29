export const testCases = {
    case1: {
        name: "Presupuesto Bajo (Bloqueo)",
        data: {
            company: "Cafetería Aroma",
            business_type: "Restaurantes, cafeterías y bares",
            budget: "Menor a 550",
            whatsapp: "0987654321"
        },
        expected: "Alert: Gracias..., NO WhatsApp"
    },
    case2: {
        name: "Presupuesto Medio (Éxito)",
        data: {
            company: "TechStore Solutions",
            business_type: "Tecnología, informática y electrónica",
            budget: "550-700",
            whatsapp: "0999888777"
        },
        expected: "Abre WhatsApp con datos correctos"
    },
    case3: {
        name: "Presupuesto Alto (Éxito)",
        data: {
            company: "Gimnasio PowerFit",
            business_type: "Fitness, deporte y gimnasios",
            budget: "Mayor a 1000",
            whatsapp: "0987123456"
        },
        expected: "Abre WhatsApp con datos correctos"
    },
    case4: {
        name: "Validación Teléfono (Formato)",
        data: {
            company: "Test Phone",
            business_type: "Otro",
            budget: "550-700",
            whatsapp: "098-765-4321" // Should be auto-corrected manually or test paste
        },
        note: "Manual check: Input should strip non-numbers",
        expected: "Input value becomes 0987654321"
    },
    case5: {
        name: "Validación Teléfono (9 dígitos)",
        data: {
            company: "Boutique Elegance",
            business_type: "Moda, ropa y accesorios",
            budget: "550-700",
            whatsapp: "098765432"
        },
        expected: "HTML5 validation blocks submit"
    },
    case9: {
        name: "Caracteres Especiales",
        data: {
            company: "Café & Té La Ñ",
            business_type: "Restaurantes, cafeterías y bares",
            budget: "Mayor a 1000",
            whatsapp: "0987654321"
        },
        expected: "WhatsApp message handles é, &, Ñ correctly"
    },
    case12: {
        name: "XSS Attempt",
        data: {
            company: "<script>alert('XSS')</script>",
            business_type: "Otro",
            budget: "550-700",
            whatsapp: "0987654321"
        },
        expected: "Text appears literally in WhatsApp, no execution"
    }
};

export function fillForm(caseId) {
    const testCase = testCases[caseId];
    if (!testCase) {
        console.error(`Case ${caseId} not found`);
        return;
    }

    console.group(`🧪 Setting up Test: ${testCase.name}`);
    console.log(`Expected: ${testCase.expected}`);

    document.getElementById('company').value = testCase.data.company;

    // Select handling
    const busSelect = document.getElementById('business_type');
    // Try to find matching option value, or default to first valid if specific not found
    let foundBus = false;
    for (let opt of busSelect.options) {
        if (opt.value === testCase.data.business_type) {
            busSelect.value = testCase.data.business_type;
            foundBus = true;
            break;
        }
    }
    if (!foundBus && testCase.data.business_type === "Otro") {
        busSelect.value = "Otro"; // Fallback
    }

    document.getElementById('budget').value = testCase.data.budget;

    // Simulate typing for phone to trigger input events if necessary
    const phoneInput = document.getElementById('whatsapp');
    phoneInput.value = testCase.data.whatsapp;

    // Trigger input event manually for phone sanitization check
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));

    console.log("✅ Form Filled. Please click 'Agenda tu Visita' to execute.");
    console.groupEnd();
}
