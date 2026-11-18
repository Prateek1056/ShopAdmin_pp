
import { queryOptions } from "@tanstack/react-query";

import {
  getAllUsers,
  getUserById,
} from "./users.api";

import { queryKeys } from "../../lib/queryKeys";

// GET ALL USERS
export const usersQueryOptions = () =>
  queryOptions({
    queryKey: [queryKeys.USERS],

    queryFn: async () => {
      const response = await getAllUsers();
      return response.data;
    },
  });

// GET USER BY ID
export const userByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [queryKeys.USERS, id],

    queryFn: async () => {
      const response = await getUserById(id);
      return response.data;
    },

    enabled: !!id,
  });
