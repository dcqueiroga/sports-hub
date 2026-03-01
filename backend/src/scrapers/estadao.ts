import puppeteer from "puppeteer";
import { RawEvent } from "../types.js";
import { normalizeWhitespace } from "../utils/text.js";

const ESTADAO_URL = "https://www.estadao.com.br/esportes/programacao-tv/";

type BrowserRow = {
  title: string;
  details: string;
};

function parseRow(row: BrowserRow, targetDate: Date): RawEvent | null {
  const title = normalizeWhitespace(row.title);
  const details = normalizeWhitespace(row.details);
  const titleMatch = title.match(/^(\d{1,2}h(?:\d{2})?)\s+(.+)$/i);

  if (!titleMatch) return null;

  const [, eventTime, matchupOrDescription] = titleMatch;
  const teams = matchupOrDescription.split(/\s+x\s+/i);
  const [competitionPart, ...serviceParts] = details.split(",");

  return {
    source: "estadao",
    sport: "futebol",
    competition: normalizeWhitespace(competitionPart || "Não informado"),
    eventDate: targetDate,
    eventTime,
    homeTeam: teams.length === 2 ? normalizeWhitespace(teams[0]) : undefined,
    awayTeam: teams.length === 2 ? normalizeWhitespace(teams[1]) : undefined,
    description: teams.length === 2 ? undefined : matchupOrDescription,
    services: serviceParts.map((part) => normalizeWhitespace(part)).filter(Boolean)
  };
}

export async function scrapeEstadao(targetDate: Date): Promise<RawEvent[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 SportsHubBot/1.0");
    await page.goto(ESTADAO_URL, { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector("main", { timeout: 10000 });

    const rows = await page.evaluate(() => {
      const allHeadings = Array.from(document.querySelectorAll("h3, h4"));
      return allHeadings
        .map((heading) => {
          const detailsNode = heading.nextElementSibling;
          return {
            title: heading.textContent ?? "",
            details: detailsNode?.textContent ?? ""
          };
        })
        .filter((row) => row.title && row.details);
    });

    return rows.map((row) => parseRow(row, targetDate)).filter((event): event is RawEvent => Boolean(event));
  } finally {
    await browser.close();
  }
}
