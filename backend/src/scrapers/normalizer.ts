import crypto from "node:crypto";
import { NormalizedEvent, RawEvent } from "../types.js";
import { normalizeWhitespace, slugify } from "../utils/text.js";

const teamAliases: Record<string, string> = {
  "sao paulo fc": "Sao Paulo",
  "spfc": "Sao Paulo",
  "manchester utd": "Manchester United",
  "palmeiras futebol clube": "Palmeiras"
};

const serviceAliases: Record<string, string> = {
  "disney+ premium": "Disney+",
  "hbo max": "Max",
  "youtube (cazetv)": "YouTube CazeTV",
  "recordplus": "Record Plus"
};

function normalizeTeam(name?: string): string | undefined {
  if (!name) return undefined;
  const normalized = normalizeWhitespace(name);
  const aliasKey = slugify(normalized).replace(/-/g, " ");
  return teamAliases[aliasKey] || normalized;
}

function normalizeService(name: string): string {
  const normalized = normalizeWhitespace(name);
  const aliasKey = slugify(normalized).replace(/-/g, " ");
  return serviceAliases[aliasKey] || normalized;
}

function toSourceHash(event: RawEvent): string {
  const hashInput = [
    event.eventDate.toISOString().slice(0, 10),
    event.eventTime,
    normalizeTeam(event.homeTeam) || "",
    normalizeTeam(event.awayTeam) || "",
    normalizeWhitespace(event.description || ""),
    normalizeWhitespace(event.competition)
  ].join("|");
  return crypto.createHash("sha256").update(hashInput).digest("hex");
}

export function normalizeAndMergeEvents(rawEvents: RawEvent[]): NormalizedEvent[] {
  const mergedByHash = new Map<string, NormalizedEvent>();

  for (const event of rawEvents) {
    const sourceHash = toSourceHash(event);
    const normalizedServices = [...new Set(event.services.map((service) => normalizeService(service)).filter(Boolean))];

    const normalizedEvent: NormalizedEvent = {
      ...event,
      homeTeam: normalizeTeam(event.homeTeam),
      awayTeam: normalizeTeam(event.awayTeam),
      normalizedServices,
      sourceHash
    };

    const existing = mergedByHash.get(sourceHash);
    if (!existing) {
      mergedByHash.set(sourceHash, normalizedEvent);
      continue;
    }

    const mergedServices = [...new Set([...existing.normalizedServices, ...normalizedServices])];
    mergedByHash.set(sourceHash, {
      ...existing,
      normalizedServices: mergedServices,
      services: mergedServices
    });
  }

  return [...mergedByHash.values()];
}
