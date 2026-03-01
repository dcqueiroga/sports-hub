import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {
  sports: string[];
  selectedSport?: string;
  onSelectSport: (sport?: string) => void;
};

export function SportFilter({ sports, selectedSport, onSelectSport }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
      <View className="flex-row gap-2">
        <TouchableOpacity
          className={`rounded-full border px-3 py-2 ${!selectedSport ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"}`}
          onPress={() => onSelectSport(undefined)}
        >
          <Text className={`text-xs font-semibold ${!selectedSport ? "text-white" : "text-slate-700"}`}>Todos</Text>
        </TouchableOpacity>
        {sports.map((sport) => {
          const selected = selectedSport === sport;
          return (
            <TouchableOpacity
              key={sport}
              className={`rounded-full border px-3 py-2 ${selected ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"}`}
              onPress={() => onSelectSport(sport)}
            >
              <Text className={`text-xs font-semibold ${selected ? "text-white" : "text-slate-700"}`}>{sport}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
