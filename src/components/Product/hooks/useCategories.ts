import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";
import { Category } from "../types/product";

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: api.fetchCategories,
    staleTime: 60 * 1000,
  });
};