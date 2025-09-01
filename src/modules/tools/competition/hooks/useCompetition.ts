import { useQuery } from "@tanstack/react-query";
import { authMLToken } from "../services/competitionService";

export function useMLToken() {
  return useQuery({
    queryKey: ["mlToken"],
    queryFn: () => authMLToken(),
  });
}
