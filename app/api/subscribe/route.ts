import { createClient } from "@vercel/edge-config";
import { NextResponse } from "next/server";

interface Subscriber {
  email: string;
  subscribedAt: string;
}

const config = createClient(process.env.EDGE_CONFIG);

export async function POST(request: Request) {
  if (!config) {
    return NextResponse.json(
      { error: "Edge Config not initialized" },
      { status: 500 }
    );
  }

  try {
    const { email } = await request.json();

    // Get current subscribers
    const currentSubscribers = await config.get<Subscriber[]>("subscribers");

    // Initialize or update subscribers array
    const updatedSubscribers = [
      ...(currentSubscribers || []),
      {
        email,
        subscribedAt: new Date().toISOString(),
      },
    ];

    // Extract Edge Config ID from the connection string
    const edgeConfigUrl = new URL(process.env.EDGE_CONFIG || "");
    const edgeConfigId = edgeConfigUrl.pathname.split("/").pop();

    // Update using Vercel Edge Config API
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              operation: "update",
              key: "subscribers",
              value: updatedSubscribers,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Edge Config Error:", {
        status: response.status,
        body: errorText,
      });
      throw new Error(`Failed to update Edge Config: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscription error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
