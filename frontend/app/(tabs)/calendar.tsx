import { format } from "date-fns";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { DaySelector } from "@/components/DaySelector";
import { EventCard } from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";

function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export default function CalendarScreen() {
  const [date, setDate] = useState(todayIso());
  const { data: events = [], isLoading } = useEvents(date);

  return (
    <View className="flex-1 bg-zinc-950 px-4 pt-4">
      <View className="mb-1 flex-row items-center gap-2">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 28, height: 28, borderRadius: 6 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-zinc-50">Calendário</Text>
      </View>
      <Text className="mb-2 text-sm text-zinc-400">Selecione o dia para ver a programação</Text>
      <DaySelector selectedDate={date} onSelectDate={setDate} />

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
          ListEmptyComponent={<Text className="py-6 text-center text-zinc-500">Nenhum evento nesse dia.</Text>}
        />
      )}
    </View>
  );
}
