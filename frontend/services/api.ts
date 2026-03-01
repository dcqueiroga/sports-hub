export type StreamingService = {
  id: string;
  name: string;
  slug: string;
  type: "streaming" | "tv" | "free_online";
};

export type SportsEvent = {
  id: string;
  sport: string;
  competition: string;
  homeTeam?: string;
  awayTeam?: string;
  description?: string;
  eventTime: string;
  source: string;
  services: StreamingService[];
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function fetchEvents(date: string, sport?: string, service?: string): Promise<SportsEvent[]> {
  const params = new URLSearchParams({ date });
  if (sport) params.set("sport", sport);
  if (service) params.set("service", service);

  const response = await fetch(`${API_BASE_URL}/api/events?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to load events");
  }
  const payload = (await response.json()) as { events: SportsEvent[] };
  return payload.events;
}

export async function fetchSports(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/sports`);
  if (!response.ok) throw new Error("Failed to load sports");
  const payload = (await response.json()) as { sports: Array<{ name: string }> };
  return payload.sports.map((sport) => sport.name);
}

export async function fetchServices(): Promise<StreamingService[]> {
  const response = await fetch(`${API_BASE_URL}/api/services`);
  if (!response.ok) throw new Error("Failed to load services");
  const payload = (await response.json()) as { services: StreamingService[] };
  return payload.services;
}
