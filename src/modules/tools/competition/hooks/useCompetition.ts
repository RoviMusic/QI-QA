import { useQuery } from "@tanstack/react-query";
import { competenciaService } from "../services/competitionService";


export function useMLToken(){
    return useQuery({
        queryKey: ['mlToken'],
        queryFn: () => competenciaService.authMLToken()
    })
}