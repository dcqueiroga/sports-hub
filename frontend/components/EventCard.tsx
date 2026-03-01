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
    <View className="mb-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="mr-3 flex-1 text-base font-bold text-slate-900">{eventTitle(event)}</Text>
        <Text className="text-sm font-semibold text-slate-600">{event.eventTime}</Text>
      </View>
      <Text className="mb-1 text-sm text-slate-700">{event.competition}</Text>
      <Text className="mb-3 text-xs uppercase tracking-wide text-slate-500">{event.sport}</Text>

      <View className="flex-row flex-wrap gap-2">
        {event.services.map((service) => (
          <StreamingBadge key={`${event.id}-${service.id}`} service={service} />
        ))}
      </View>
    </View>
  );
}
