
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveUser, deleteUser } from "./users.api";
import type {
  SaveUserRequest,
  DeleteUserRequest,
} from "./users.types";
import { queryKeys } from "../../lib/queryKeys";

export function useSaveUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (details: SaveUserRequest) => saveUser(details),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS],
      });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (details: DeleteUserRequest) => deleteUser(details),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS],
      });
    },
  });
}
