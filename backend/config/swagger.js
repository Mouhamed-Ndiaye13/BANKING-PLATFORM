import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Projet Banking API",
      version: "1.0.0",
      description: "Documentation de l'API du projet de groupe",
    },
    servers: [
      {
        url: "http://localhost:5173", // URL locale de ton backend
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // pour les routes protégées
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Swagger lira tous les fichiers de routes
};

export const swaggerSpec = swaggerJSDoc(options);
