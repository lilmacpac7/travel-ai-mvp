import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { destination, days, budget, travelStyle, companions, interests } = body;

        const prompt = `
Create a clean, easy-to-read ${days}-day travel itinerary for ${destination}.

IMPORTANT:
- Do NOT use markdown (** or ##)
- Use plain text only
- Use clear headings like:
  Day 1:
  Day 2:

Include:
- Activities
- Food
- Tips

Make it look clean and structured.
`;

        const response = await client.responses.create({
            model: "gpt-4.1-mini",
            input: prompt,
        });

        return Response.json({
            itinerary: response.output_text,
        });

    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to generate itinerary" }, { status: 500 });
    }
}