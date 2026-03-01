import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { DaySelector } from "@/components/DaySelector";
import { EventCard } from "@/components/EventCard";
import { SportFilter } from "@/components/SportFilter";
import { useEvents, useSports } from "@/hooks/useEvents";

function isoToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export default function HomeScreen() {
  const [date, setDate] = useState(isoToday());
  const [selectedSport, setSelectedSport] = useState<string | undefined>(undefined);
  const { data: events = [], isLoading } = useEvents(date, selectedSport);
  const { data: sports = [] } = useSports();

  const title = useMemo(() => {
    const parsed = new Date(`${date}T00:00:00`);
    return format(parsed, "EEEE, dd 'de' MMMM", { locale: ptBR });
  }, [date]);

  return (
    <View className="flex-1 bg-zinc-950 px-4 pt-4">
      <Image
        source={require("@/assets/images/logo-onde-passa.png")}
        style={{ width: 160, height: 40 }}
        resizeMode="contain"
      />
      <Text className="mb-2 text-sm text-zinc-400">{title}</Text>

      <DaySelector selectedDate={date} onSelectDate={setDate} />
      <SportFilter sports={sports} selectedSport={selectedSport} onSelectSport={setSelectedSport} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22d3ee" />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          renderItem={({ item }) => <EventCard event={item} />}
          ListEmptyComponent={<Text className="py-6 text-center text-zinc-500">Nenhum evento encontrado.</Text>}
        />
      )}
    </View>
  );
}
