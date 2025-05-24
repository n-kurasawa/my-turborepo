import { z } from "zod";

// Hello World スキーマ
export const HelloWorldSchema = z.object({
  message: z.string(),
  timestamp: z.string(),
});

// Health Check スキーマ
export const HealthSchema = z.object({
  status: z.string(),
  service: z.string(),
  timestamp: z.string(),
});

// API Hello スキーマ
export const ApiHelloRequestSchema = z.object({
  name: z.string().optional(),
  message: z.string().optional(),
});

export const ApiHelloResponseSchema = z.object({
  greeting: z.string(),
  receivedData: z.object({
    name: z.string().optional(),
    message: z.string().optional(),
  }),
  version: z.string(),
  timestamp: z.string(),
});
