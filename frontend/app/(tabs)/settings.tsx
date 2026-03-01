import { useMemo, useState } from "react";
import { Image, ScrollView, Switch, Text, View } from "react-native";
import { useServices, useSportsCatalog } from "@/hooks/useCatalog";

export default function SettingsScreen() {
  const { data: sports = [] } = useSportsCatalog();
  const { data: services = [] } = useServices();
  const [notifyFavoriteTeams, setNotifyFavoriteTeams] = useState(false);

  const groupedServices = useMemo(() => {
    return {
      streaming: services.filter((service) => service.type === "streaming"),
      tv: services.filter((service) => service.type === "tv"),
      free_online: services.filter((service) => service.type === "free_online")
    };
  }, [services]);

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-4">
      <View className="mb-1 flex-row items-center gap-2">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 28, height: 28, borderRadius: 6 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-zinc-50">Filtros</Text>
      </View>
      <Text className="mb-4 text-sm text-zinc-400">Configure esportes favoritos e alertas</Text>

      <View className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <Text className="mb-2 text-base font-bold text-zinc-50">Esportes monitorados</Text>
        {sports.length === 0 ? (
          <Text className="text-sm text-zinc-500">Carregando esportes...</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {sports.map((sport) => (
              <View key={sport} className="rounded-full bg-cyan-950 px-3 py-1">
                <Text className="text-xs font-semibold text-cyan-300">{sport}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <Text className="mb-2 text-base font-bold text-zinc-50">Streaming e canais</Text>
        <Text className="mb-2 text-sm font-semibold text-zinc-300">Streaming</Text>
        {groupedServices.streaming.map((service) => (
          <Text key={service.id} className="text-sm text-zinc-400">
            - {service.name}
          </Text>
        ))}

        <Text className="mb-2 mt-3 text-sm font-semibold text-zinc-300">TV</Text>
        {groupedServices.tv.map((service) => (
          <Text key={service.id} className="text-sm text-zinc-400">
            - {service.name}
          </Text>
        ))}

        <Text className="mb-2 mt-3 text-sm font-semibold text-zinc-300">Grátis online</Text>
        {groupedServices.free_online.map((service) => (
          <Text key={service.id} className="text-sm text-zinc-400">
            - {service.name}
          </Text>
        ))}
      </View>

      <View className="mb-8 flex-row items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <View>
          <Text className="text-base font-bold text-zinc-50">Alertas de times favoritos</Text>
          <Text className="text-sm text-zinc-400">Ativar notificações (próxima fase)</Text>
        </View>
        <Switch
          value={notifyFavoriteTeams}
          onValueChange={setNotifyFavoriteTeams}
          thumbColor={notifyFavoriteTeams ? "#22d3ee" : "#a1a1aa"}
          trackColor={{ false: "#3f3f46", true: "#164e63" }}
        />
      </View>
    </ScrollView>
  );
}
