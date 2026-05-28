import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LuminaLib Management API Specification',
      version: '1.0.0',
      description: 'Production-grade Library Management System API Specifications. Includes security schemes, query pagination, and analytical endpoints.',
      contact: {
        name: 'API Support Architect',
        email: 'support@luminalib.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Input your active session token obtained from /auth/login inside this gate (format: raw JWT string).',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/docs/**/*.ts',
    './src/docs/**/*.js',
    './dist/docs/**/*.js',
    './src/modules/**/*.ts',
    './src/routes/**/*.ts',
    './src/app.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
