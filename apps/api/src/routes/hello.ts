import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

// Hello World スキーマ
const HelloWorldSchema = z.object({
  message: z.string(),
  timestamp: z.string(),
});

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

export const helloWorldApp = new OpenAPIHono().openapi(helloWorldRoute, (c) => {
  return c.json({
    message: "Hello World!",
    timestamp: new Date().toISOString(),
  });
});
