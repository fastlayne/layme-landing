import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const proxyRes = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer lm-studio",
      },
      body: JSON.stringify(req.body),
    });

    const data = await proxyRes.json();
    res.status(proxyRes.status).json(data);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Server error";
    res.status(500).json({ error: errorMessage });
  }
}
