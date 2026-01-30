import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Test API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Use absolute path to ensure only the route file is scanned
  apis: [
    path.join(__dirname, '../routes/auth.routes.ts'),
    path.join(__dirname, '../routes/product.routes.ts'),
    path.join(__dirname, '../routes/order.routes.ts'),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);