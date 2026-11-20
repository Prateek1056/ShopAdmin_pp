
import { useMutation, useQuery } from "@tanstack/react-query";

import { ApiUtility } from "../lib/apiUtility";
import { queryClient } from "../lib/queryClient";
import { queryKeys } from "../lib/queryKeys";

import type {
  UserDto,
  SaveUserRequest,
  DeleteUserRequest,
} from "../types/users.types";

const route = "/User";

// GET ALL USERS
export const useGetUsers = () =>
  useQuery({
    queryKey: [queryKeys.USERS],
    queryFn: async () =>
      await ApiUtility.get<UserDto[]>(`${route}/GetAll`),
  });

// GET USER BY ID
export const useGetUser = (id?: string) =>
  useQuery({
    queryKey: [queryKeys.USERS, id],
    queryFn: async () =>
      await ApiUtility.get<UserDto>(
        `${route}/GetById/${id}`
      ),
    enabled: !!id,
  });

// SAVE USER
export const useSaveUser = () =>
  useMutation({
    mutationFn: async (params: SaveUserRequest) =>
      await ApiUtility.post<boolean>(`${route}/Save`, params),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS],
      });
    },
  });

// DELETE USER
export const useDeleteUser = () =>
  useMutation({
    mutationFn: async (params: DeleteUserRequest) =>
      await ApiUtility.post<boolean>(`${route}/Delete`, params),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.USERS],
      });
    },
  });
