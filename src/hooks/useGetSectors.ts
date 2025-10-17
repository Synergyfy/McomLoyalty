import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { SectorResponse } from '@/types/sectors';

export const useGetSectors = () => {
  return useQuery<SectorResponse[], Error>({
    queryKey: ['sectors'],
    queryFn: async () => {
      const response = await api.get<SectorResponse[]>('/sectors');
      return response.data;
    },
  });
};
