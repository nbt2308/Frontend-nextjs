import axiosClient from "../lib/axiosClient";
import { ICreateInteraction } from "@/schemas/interaction.schema";


export const InteractionService = {
    toggle: async (interactionData: ICreateInteraction) => {
        try {
            const response = await axiosClient.post(`/interaction/toggle`, interactionData);

            return response.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}