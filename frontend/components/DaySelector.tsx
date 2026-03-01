import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {
  selectedDate: string;
  onSelectDate: (value: string) => void;
};

function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function DaySelector({ selectedDate, onSelectDate }: Props) {
  const baseDate = new Date();
  const days = Array.from({ length: 7 }, (_, index) => addDays(baseDate, index));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
      <View className="flex-row gap-2">
        {days.map((day) => {
          const isoDate = toIsoDate(day);
          const selected = isoDate === selectedDate;
          return (
            <TouchableOpacity
              key={isoDate}
              className={`rounded-xl border px-3 py-2 ${selected ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"}`}
              onPress={() => onSelectDate(isoDate)}
            >
              <Text className={`text-xs font-semibold ${selected ? "text-white" : "text-slate-600"}`}>
                {format(day, "EEE", { locale: ptBR })}
              </Text>
              <Text className={`text-sm font-bold ${selected ? "text-white" : "text-slate-900"}`}>
                {format(day, "dd/MM")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
