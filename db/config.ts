import { defineDb, defineTable, column } from 'astro:db';

// Tabla para capturar los leads del formulario de contacto
export const Lead = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    company: column.text(),
    businessType: column.text(),
    budget: column.text(),
    whatsapp: column.text(),
    createdAt: column.date({ default: new Date() }),
  }
});

// Tabla para la futura expansión de "Nuestras Marcas"
export const Brand = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    logoUrl: column.text({ optional: true }), // Referencia a la imagen en public o remota
    description: column.text({ optional: true }),
    isVisible: column.boolean({ default: true }),
    createdAt: column.date({ default: new Date() }),
  }
});

export default defineDb({
  tables: { Lead, Brand },
});
