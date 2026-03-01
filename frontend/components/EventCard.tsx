import { Text, View } from "react-native";
import { SportsEvent } from "@/services/api";
import { StreamingBadge } from "./StreamingBadge";

type Props = {
  event: SportsEvent;
};

function eventTitle(event: SportsEvent): string {
  if (event.homeTeam && event.awayTeam) {
    return `${event.homeTeam} x ${event.awayTeam}`;
  }
  return event.description || "Evento esportivo";
}

export function EventCard({ event }: Props) {
  return (
    <View className="mb-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="mr-3 flex-1 text-base font-bold text-zinc-50">{eventTitle(event)}</Text>
        <Text className="text-sm font-semibold text-cyan-400">{event.eventTime}</Text>
      </View>
      <Text className="mb-1 text-sm text-zinc-300">{event.competition}</Text>
      <Text className="mb-3 text-xs uppercase tracking-wide text-zinc-500">{event.sport}</Text>

      <View className="flex-row flex-wrap gap-2">
        {event.services.map((service) => (
          <StreamingBadge key={`${event.id}-${service.id}`} service={service} />
        ))}
      </View>
    </View>
  );
}
