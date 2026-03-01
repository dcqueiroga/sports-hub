import { useMemo, useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
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
    <ScrollView className="flex-1 bg-slate-100 px-4 pt-4">
      <Text className="mb-1 text-2xl font-bold text-slate-900">Filtros</Text>
      <Text className="mb-4 text-sm text-slate-600">Configure esportes favoritos e alertas</Text>

      <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="mb-2 text-base font-bold text-slate-900">Esportes monitorados</Text>
        {sports.length === 0 ? (
          <Text className="text-sm text-slate-500">Carregando esportes...</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {sports.map((sport) => (
              <View key={sport} className="rounded-full bg-blue-100 px-3 py-1">
                <Text className="text-xs font-semibold text-blue-900">{sport}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <Text className="mb-2 text-base font-bold text-slate-900">Streaming e canais</Text>
        <Text className="mb-2 text-sm font-semibold text-slate-700">Streaming</Text>
        {groupedServices.streaming.map((service) => (
          <Text key={service.id} className="text-sm text-slate-600">
            - {service.name}
          </Text>
        ))}

        <Text className="mb-2 mt-3 text-sm font-semibold text-slate-700">TV</Text>
        {groupedServices.tv.map((service) => (
          <Text key={service.id} className="text-sm text-slate-600">
            - {service.name}
          </Text>
        ))}

        <Text className="mb-2 mt-3 text-sm font-semibold text-slate-700">Gratis online</Text>
        {groupedServices.free_online.map((service) => (
          <Text key={service.id} className="text-sm text-slate-600">
            - {service.name}
          </Text>
        ))}
      </View>

      <View className="mb-8 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <View>
          <Text className="text-base font-bold text-slate-900">Alertas de times favoritos</Text>
          <Text className="text-sm text-slate-600">Ativar notificacoes (proxima fase)</Text>
        </View>
        <Switch value={notifyFavoriteTeams} onValueChange={setNotifyFavoriteTeams} />
      </View>
    </ScrollView>
  );
}
