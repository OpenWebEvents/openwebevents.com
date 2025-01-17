import { createClient } from "@vercel/edge-config";
import { NextResponse } from "next/server";

interface Subscriber {
  email: string;
  subscribedAt: string;
}

const config = createClient(process.env.EDGE_CONFIG);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const currentSubscribers = ((await config.get("subscribers")) ||
      []) as Subscriber[];

    const updatedSubscribers: Subscriber[] = [
      ...currentSubscribers,
      {
        email,
        subscribedAt: new Date().toISOString(),
      },
    ];

    // Use type assertion only for the specific operation
    await (
      config as unknown as { set(key: string, value: unknown): Promise<void> }
    ).set("subscribers", updatedSubscribers);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscription error:", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
