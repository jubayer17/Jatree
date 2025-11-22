import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    answer: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== "POST") {
        return res.status(405).json({ answer: "Method not allowed" });
    }

    try {
        const { question } = req.body;
        if (!question) return res.status(400).json({ answer: "No question provided." });

        // Call your FastAPI backend
        const r = await fetch("http://localhost:8000/chat/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });

        const data = await r.json();
        res.status(200).json({ answer: data.answer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ answer: "Error contacting AI server." });
    }
}
