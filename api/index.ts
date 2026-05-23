// import "tsconfig-paths/register"; // kalo mau pake import bagus (Boleh di hapus)
import app from "../src/app";
// import type { VercelRequest, VercelResponse } from "@vercel/node"; // ini gak termasuk import bagus

// Export app untuk Vercel serverless
export default app;
