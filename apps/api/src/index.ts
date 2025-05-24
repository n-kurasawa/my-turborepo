import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  registerApiHelloRoute,
  registerHealthRoute,
  registerHelloWorldRoute,
} from "./routes";

const app = new OpenAPIHono();

// エンドポイントの登録
registerHelloWorldRoute(app);
registerHealthRoute(app);
registerApiHelloRoute(app);

// OpenAPI JSONドキュメント
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Hono API",
    description: "A simple API built with Hono and Zod OpenAPI",
  },
});

// Swagger UI
app.get("/ui", swaggerUI({ url: "/doc" }));

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

console.log(`🚀 Server is running on http://localhost:${port}`);
console.log(`📖 API documentation available at http://localhost:${port}/ui`);
console.log(`📄 OpenAPI JSON available at http://localhost:${port}/doc`);

serve({
  fetch: app.fetch,
  port,
});
