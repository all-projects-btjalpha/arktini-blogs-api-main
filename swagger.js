// Swagger configuration for Express
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const API_URL = process.env.API_URL || 'http://localhost:5003';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GYPRC Blogs Portal API',
      version: '1.0.0',
      description: 'API documentation for GYPRC Blogs Portal',
    },
    servers: [
      {
        url: API_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      { bearerAuth: [] }
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
