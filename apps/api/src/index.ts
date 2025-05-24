import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";

const app = new OpenAPIHono();

// Zodスキーマ定義
const HelloWorldSchema = z.object({
  message: z.string(),
  timestamp: z.string(),
});

const HealthSchema = z.object({
  status: z.string(),
  service: z.string(),
  timestamp: z.string(),
});

const ApiHelloRequestSchema = z.object({
  name: z.string().optional(),
  message: z.string().optional(),
});

const ApiHelloResponseSchema = z.object({
  greeting: z.string(),
  receivedData: z.object({
    name: z.string().optional(),
    message: z.string().optional(),
  }),
  version: z.string(),
  timestamp: z.string(),
});

// Hello World エンドポイント
const helloWorldRoute = createRoute({
  method: "get",
  path: "/",
  summary: "Hello World",
  description: "Returns a simple hello world message",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HelloWorldSchema,
        },
      },
      description: "Successful response",
    },
  },
});

app.openapi(helloWorldRoute, (c) => {
  return c.json({
    message: "Hello World!",
    timestamp: new Date().toISOString(),
  });
});

// API ヘルスチェック
const healthRoute = createRoute({
  method: "get",
  path: "/health",
  summary: "Health Check",
  description: "Returns the health status of the API",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HealthSchema,
        },
      },
      description: "Health check successful",
    },
  },
});

app.openapi(healthRoute, (c) => {
  return c.json({
    status: "OK",
    service: "Hono API",
    timestamp: new Date().toISOString(),
  });
});

// API Hello エンドポイント
const apiHelloRoute = createRoute({
  method: "post",
  path: "/api/hello",
  summary: "API Hello",
  description:
    "Receives parameters and returns a greeting with the received data",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ApiHelloRequestSchema,
        },
      },
      description: "Request body with optional name and message",
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ApiHelloResponseSchema,
        },
      },
      description: "Successful API hello response with received data",
    },
  },
});

app.openapi(apiHelloRoute, async (c) => {
  const body = await c.req.json();
  const { name, message } = ApiHelloRequestSchema.parse(body);

  const greeting = name ? `Hello, ${name}!` : "Hello from Hono API!";

  return c.json({
    greeting,
    receivedData: {
      name,
      message,
    },
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

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
