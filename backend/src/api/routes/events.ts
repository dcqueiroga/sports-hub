import { Router } from "express";
import { prisma } from "../../config/db.js";
import { endOfDay, parseDateQuery } from "../utils.js";

export const eventsRouter = Router();

eventsRouter.get("/", async (req, res) => {
  try {
    const date = parseDateQuery(req.query.date as string | undefined);
    const sport = (req.query.sport as string | undefined)?.toLowerCase();
    const service = (req.query.service as string | undefined)?.toLowerCase();

    const events = await prisma.event.findMany({
      where: {
        eventDate: {
          gte: date,
          lte: endOfDay(date)
        },
        ...(sport
          ? {
              sport: {
                name: sport
              }
            }
          : {}),
        ...(service
          ? {
              broadcasts: {
                some: {
                  service: {
                    slug: service
                  }
                }
              }
            }
          : {})
      },
      include: {
        sport: true,
        broadcasts: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        eventTime: "asc"
      }
    });

    return res.json({
      date: date.toISOString().slice(0, 10),
      total: events.length,
      events: events.map((event) => ({
        id: event.id,
        sport: event.sport.name,
        competition: event.competition,
        homeTeam: event.homeTeam,
        awayTeam: event.awayTeam,
        description: event.description,
        eventTime: event.eventTime,
        source: event.source,
        services: event.broadcasts.map((broadcast) => ({
          id: broadcast.service.id,
          name: broadcast.service.name,
          slug: broadcast.service.slug,
          type: broadcast.service.type
        }))
      }))
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Could not list events"
    });
  }
});
