import axios from "axios";
import { load } from "cheerio";
import { RawEvent } from "../types.js";
import { normalizeWhitespace } from "../utils/text.js";

const FOLHA_URL = "https://www1.folha.uol.com.br/esporte/jogo-ao-vivo.shtml";

function parseTimeAndMatch(text: string): {
  eventTime: string;
  homeTeam?: string;
  awayTeam?: string;
  description?: string;
} | null {
  const normalized = normalizeWhitespace(text);
  const match = normalized.match(/^(\d{1,2}h(?:\d{2})?)\s+(.+)$/i);
  if (!match) return null;

  const [, eventTime, title] = match;
  const teams = title.split(/\s+x\s+/i);
  if (teams.length === 2) {
    return {
      eventTime,
      homeTeam: normalizeWhitespace(teams[0]),
      awayTeam: normalizeWhitespace(teams[1])
    };
  }

  return {
    eventTime,
    description: title
  };
}

export async function scrapeFolha(targetDate: Date): Promise<RawEvent[]> {
  const response = await axios.get<string>(FOLHA_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 SportsHubBot/1.0"
    },
    timeout: 15000
  });

  const $ = load(response.data);
  const events: RawEvent[] = [];
  const headings = $("h3");

  headings.each((_, element) => {
    const maybeMatch = parseTimeAndMatch($(element).text());
    if (!maybeMatch) return;

    const detailText = normalizeWhitespace($(element).next("p").text() || $(element).parent().find("p").first().text());
    if (!detailText) return;

    const [competitionPart, ...serviceParts] = detailText.split(",");
    const competition = normalizeWhitespace(competitionPart || "Não informado");
    const services = serviceParts.map((part) => normalizeWhitespace(part)).filter(Boolean);

    events.push({
      source: "folha",
      sport: "futebol",
      competition,
      eventDate: targetDate,
      eventTime: maybeMatch.eventTime,
      homeTeam: maybeMatch.homeTeam,
      awayTeam: maybeMatch.awayTeam,
      description: maybeMatch.description,
      services
    });
  });

  return events;
}
