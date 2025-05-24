import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

// Health Check スキーマ
const HealthSchema = z.object({
  status: z.string(),
  service: z.string(),
  timestamp: z.string(),
});

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

export function registerHealthRoute(app: OpenAPIHono) {
  app.openapi(healthRoute, (c) => {
    return c.json({
      status: "OK",
      service: "Hono API",
      timestamp: new Date().toISOString(),
    });
  });
}
