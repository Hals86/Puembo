import { db, Lead } from 'astro:db';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
    submitLead: defineAction({
        accept: 'form',
        input: z.object({
            company: z.string().min(2, "El nombre del negocio es muy corto").max(100),
            business_type: z.string().min(1, "Selecciona un giro de negocio"),
            budget: z.string().min(1, "Selecciona un presupuesto"),
            whatsapp: z.string().regex(/^09[0-9]{8}$/, "El número debe empezar con 09 y tener 10 dígitos"),
            website: z.string().optional(), // Honeypot field
        }),
        handler: async (input) => {
            // 🛡️ Security Check: Honeypot (if filled, it's a bot)
            if (input.website) {
                console.warn("Honeypot triggered by bot submission");
                return { success: false, message: "Bot detected" };
            }

            // 🛡️ Security Check: Basic sanitization to prevent XSS
            const sanitize = (str: string) => str.replace(/[<>]/g, "");

            try {
                await db.insert(Lead).values({
                    company: sanitize(input.company),
                    businessType: sanitize(input.business_type),
                    budget: sanitize(input.budget),
                    whatsapp: input.whatsapp,
                    createdAt: new Date(),
                });

                return { success: true, message: "Lead guardado correctamente" };
            } catch (error) {
                console.error("Error al guardar lead:", error);
                return { success: false, message: "Error al guardar en la base de datos" };
            }
        },
    }),
};
