import { Text, View } from "react-native";
import { StreamingService } from "@/services/api";

type Props = {
  service: StreamingService;
};

function badgeClass(type: StreamingService["type"]): string {
  if (type === "free_online") return "bg-green-950 border-green-800 text-green-400";
  if (type === "tv") return "bg-amber-950 border-amber-800 text-amber-400";
  return "bg-cyan-950 border-cyan-800 text-cyan-400";
}

export function StreamingBadge({ service }: Props) {
  return (
    <View className={`rounded-full border px-3 py-1 ${badgeClass(service.type)}`}>
      <Text className="text-xs font-semibold">{service.name}</Text>
    </View>
  );
}
