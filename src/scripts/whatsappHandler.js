export function sendWhatsAppMessage(data) {
    const { company, businessType, budget, whatsapp } = data;

    // Basic sanitization/encoding
    const cleanCompany = encodeURIComponent(company.trim());
    const cleanBusinessType = encodeURIComponent(businessType.trim());
    const cleanBudget = encodeURIComponent(budget.trim());
    const cleanWhatsapp = encodeURIComponent(whatsapp.trim());

    const message = `Hola, quiero agendar una visita.%0A` +
        `🏢 Negocio: ${cleanCompany}%0A` +
        `💼 Giro: ${cleanBusinessType}%0A` +
        `💰 Presupuesto: ${cleanBudget}%0A` +
        `📞 Contacto: ${cleanWhatsapp}`;

    // Use env var or fallback
    const phoneNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER || "593995775686";

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
}
