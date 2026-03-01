import axios from "axios";
import { RawEvent } from "../types.js";

const SPORTS = ["football", "basketball", "tennis", "motorsport"];

type SofascoreEvent = {
  tournament?: { name?: string };
  homeTeam?: { name?: string };
  awayTeam?: { name?: string };
  startTimestamp?: number;
  tvChannels?: Array<{ name?: string }>;
};

function formatTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}h${minutes}`;
}

function toDateSlug(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function scrapeSofascore(targetDate: Date): Promise<RawEvent[]> {
  const dateSlug = toDateSlug(targetDate);
  const events: RawEvent[] = [];

  for (const sport of SPORTS) {
    const url = `https://www.sofascore.com/api/v1/sport/${sport}/scheduled-events/${dateSlug}`;
    try {
      const response = await axios.get<{ events?: SofascoreEvent[] }>(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 SportsHubBot/1.0"
        },
        timeout: 15000
      });

      for (const event of response.data.events || []) {
        if (!event.startTimestamp) continue;
        events.push({
          source: "sofascore",
          sport,
          competition: event.tournament?.name || "Não informado",
          eventDate: targetDate,
          eventTime: formatTimeFromTimestamp(event.startTimestamp),
          homeTeam: event.homeTeam?.name,
          awayTeam: event.awayTeam?.name,
          description: !event.homeTeam?.name && !event.awayTeam?.name ? event.tournament?.name : undefined,
          services: (event.tvChannels || []).map((channel) => channel.name || "").filter(Boolean)
        });
      }
    } catch {
      continue;
    }
  }

  return events;
}
