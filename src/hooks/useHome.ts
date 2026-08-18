import { HomeService } from "@/services/home";
import { useQuery } from "@tanstack/react-query";

export function useHome() {
    return useQuery({
        queryKey: ['home'],
        queryFn: () => HomeService.getHome(),
        staleTime: 1000 * 60 * 5,
    });
}