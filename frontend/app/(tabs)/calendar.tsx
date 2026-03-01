import { format } from "date-fns";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
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
    <View className="flex-1 bg-slate-100 px-4 pt-4">
      <Text className="mb-1 text-2xl font-bold text-slate-900">Calendario</Text>
      <Text className="mb-2 text-sm text-slate-600">Selecione o dia para ver a programacao</Text>
      <DaySelector selectedDate={date} onSelectDate={setDate} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          renderItem={({ item }) => <EventCard event={item} />}
          ListEmptyComponent={<Text className="py-6 text-center text-slate-500">Nenhum evento nesse dia.</Text>}
        />
      )}
    </View>
  );
}
