import { useQuery } from "@tanstack/react-query";
import { fetchServices, fetchSports } from "@/services/api";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices
  });
}

export function useSportsCatalog() {
  return useQuery({
    queryKey: ["sports-catalog"],
    queryFn: fetchSports
  });
}
