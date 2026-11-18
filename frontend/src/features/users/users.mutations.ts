import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveUser, deleteUser } from "./users.api";
import type { SaveUserRequest, DeleteUserRequest } from "./users.types";
import { queryKeys } from "../../lib/queryKeys";
import queryClient from "../../lib/queryClient";

export function useSaveUserMutation() {
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
  return useMutation({
    mutationFn: (details: DeleteUserRequest) => deleteUser(details),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS],
      });
    },
  });
}
