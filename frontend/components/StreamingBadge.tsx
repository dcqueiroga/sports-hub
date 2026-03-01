import { Text, View } from "react-native";
import { StreamingService } from "@/services/api";

type Props = {
  service: StreamingService;
};

function badgeClass(type: StreamingService["type"]): string {
  if (type === "free_online") return "bg-green-100 border-green-300";
  if (type === "tv") return "bg-amber-100 border-amber-300";
  return "bg-blue-100 border-blue-300";
}

export function StreamingBadge({ service }: Props) {
  return (
    <View className={`rounded-full border px-3 py-1 ${badgeClass(service.type)}`}>
      <Text className="text-xs font-semibold text-slate-800">{service.name}</Text>
    </View>
  );
}
