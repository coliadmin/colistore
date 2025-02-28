"use server";

import {config} from "@/lib/config";

export async function sendAlert(content: string) {
  await fetch(config.coli.DISCORD_WEBHOOK!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({content: content}),
  });
}
