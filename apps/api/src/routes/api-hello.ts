import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

// API Hello スキーマ
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

export function registerApiHelloRoute(app: OpenAPIHono) {
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
}
