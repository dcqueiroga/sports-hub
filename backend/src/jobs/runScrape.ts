import { ServiceType } from "@prisma/client";
import { prisma } from "../config/db.js";
import { scrapeEstadao } from "../scrapers/estadao.js";
import { scrapeFolha } from "../scrapers/folha.js";
import { normalizeAndMergeEvents } from "../scrapers/normalizer.js";
import { scrapeSofascore } from "../scrapers/sofascore.js";
import { slugify } from "../utils/text.js";

function guessServiceType(name: string): ServiceType {
  const value = name.toLowerCase();
  if (value.includes("youtube") || value.includes("r7") || value.includes("cazetv")) {
    return ServiceType.free_online;
  }
  if (
    value.includes("espn") ||
    value.includes("sportv") ||
    value.includes("record") ||
    value.includes("band") ||
    value.includes("tnt")
  ) {
    return ServiceType.tv;
  }
  return ServiceType.streaming;
}

async function persistSourceLog(source: string, status: "ok" | "error", eventCount = 0, errorMessage?: string): Promise<void> {
  await prisma.sourceLog.create({
    data: {
      source,
      status,
      eventCount,
      errorMessage
    }
  });
}

export async function runDailyScrape(targetDate = new Date()): Promise<{ imported: number }> {
  const sourceResults = await Promise.allSettled([scrapeFolha(targetDate), scrapeEstadao(targetDate), scrapeSofascore(targetDate)]);
  const allEvents = [];

  for (const [index, result] of sourceResults.entries()) {
    const sourceName = ["folha", "estadao", "sofascore"][index];
    if (result.status === "fulfilled") {
      allEvents.push(...result.value);
      await persistSourceLog(sourceName, "ok", result.value.length);
    } else {
      await persistSourceLog(sourceName, "error", 0, result.reason instanceof Error ? result.reason.message : String(result.reason));
    }
  }

  const normalized = normalizeAndMergeEvents(allEvents);

  for (const event of normalized) {
    const sport = await prisma.sport.upsert({
      where: { name: event.sport },
      update: {},
      create: { name: event.sport }
    });

    const persistedEvent = await prisma.event.upsert({
      where: { sourceHash: event.sourceHash },
      update: {
        sportId: sport.id,
        competition: event.competition,
        homeTeam: event.homeTeam,
        awayTeam: event.awayTeam,
        description: event.description,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        source: event.source
      },
      create: {
        sportId: sport.id,
        competition: event.competition,
        homeTeam: event.homeTeam,
        awayTeam: event.awayTeam,
        description: event.description,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        source: event.source,
        sourceHash: event.sourceHash
      }
    });

    await prisma.eventBroadcast.deleteMany({ where: { eventId: persistedEvent.id } });

    for (const serviceName of event.normalizedServices) {
      const service = await prisma.streamingService.upsert({
        where: { slug: slugify(serviceName) },
        update: {
          name: serviceName,
          type: guessServiceType(serviceName)
        },
        create: {
          name: serviceName,
          slug: slugify(serviceName),
          type: guessServiceType(serviceName)
        }
      });

      await prisma.eventBroadcast.create({
        data: {
          eventId: persistedEvent.id,
          serviceId: service.id
        }
      });
    }
  }

  return { imported: normalized.length };
}
