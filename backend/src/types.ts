export type RawEvent = {
  source: "folha" | "estadao" | "sofascore";
  sport: string;
  competition: string;
  homeTeam?: string;
  awayTeam?: string;
  description?: string;
  eventDate: Date;
  eventTime: string;
  services: string[];
};

export type NormalizedEvent = RawEvent & {
  sourceHash: string;
  normalizedServices: string[];
};
