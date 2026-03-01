import { SymbolView } from "expo-symbols";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#22d3ee",
        tabBarInactiveTintColor: "#71717a",
        tabBarStyle: {
          backgroundColor: "#09090b",
          borderTopColor: "#27272a"
        },
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: "#09090b" },
        headerTitleStyle: { color: "#fafafa" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Hoje",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "list.bullet",
                android: "list",
                web: "list",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendário",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "calendar",
                android: "calendar_today",
                web: "calendar_month",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Filtros",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: "line.3.horizontal.decrease.circle",
                android: "tune",
                web: "tune",
              }}
              tintColor={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
