import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// Hello World エンドポイント
app.get("/", (c) => {
  return c.json({
    message: "Hello World!",
    timestamp: new Date().toISOString(),
  });
});

// API ヘルスチェック
app.get("/health", (c) => {
  return c.json({
    status: "OK",
    service: "Hono API",
    timestamp: new Date().toISOString(),
  });
});

// API Hello エンドポイント
app.get("/api/hello", (c) => {
  return c.json({
    message: "Hello from Hono API!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
