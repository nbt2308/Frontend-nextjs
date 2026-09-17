import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ICreateInteraction } from "@/schemas/interaction.schema";
import { InteractionService } from "@/services/interaction";


export function useToggleInteraction(queryParams: CourseUserReviewQueryParams) {
    const queryClient = useQueryClient();
    const mutationInfo = useMutation({
        mutationFn: async (interactionData: ICreateInteraction) => {
            const result = await InteractionService.toggle(interactionData);
            return result;
        },
        onSuccess: (response, variables) => {
            const result = response;

            queryClient.setQueryData(
                ["course-reviews", queryParams],
                (oldData: CourseReviewForUser | undefined) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        items: oldData.items.map(review =>
                            String(review.id) === variables.targetId
                                ? {
                                    ...review,
                                    likes: result.likes,
                                    dislikes: result.dislikes,
                                    myInteraction: result.myInteraction,
                                }
                                : review
                        ),
                    };
                },
            );
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return mutationInfo;
}