import { useQuery } from "@tanstack/react-query";
import { fetchEvents, fetchSports } from "@/services/api";

export function useEvents(date: string, sport?: string) {
  return useQuery({
    queryKey: ["events", date, sport],
    queryFn: () => fetchEvents(date, sport)
  });
}

export function useSports() {
  return useQuery({
    queryKey: ["sports"],
    queryFn: fetchSports
  });
}
