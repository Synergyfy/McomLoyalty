import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { TrainingVideo, CreateTrainingVideoDto, GetTrainingVideosParams, TrainingVideoResponse } from './types';

const TRAINING_VIDEOS_QUERY_KEY = 'trainingVideos';

// Get Training Videos (List)
const getTrainingVideos = async (params: GetTrainingVideosParams): Promise<TrainingVideoResponse> => {
  const { data } = await api.get('/training-videos', { params });

  // Manual mapping to ensure frontend camelCase matches backend snake_case
  const mappedItems = (data.items || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    videoUrl: item.video_url,
    targetAudience: item.target_audience,
    targetTierIds: item.target_tier_ids,
    createdAt: item.created_at,
  }));

  return {
    ...data,
    items: mappedItems,
  };
};

export const useGetTrainingVideos = (params: GetTrainingVideosParams) => {
  return useQuery({
    queryKey: [TRAINING_VIDEOS_QUERY_KEY, params],
    queryFn: () => getTrainingVideos(params),
  });
};

// Get Single Training Video
const getTrainingVideo = async (id: string): Promise<TrainingVideo> => {
  const { data } = await api.get(`/training-videos/${id}`);
  // Map single item
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    videoUrl: data.video_url,
    targetAudience: data.target_audience,
    targetTierIds: data.target_tier_ids,
    createdAt: data.created_at,
  };
};

export const useGetTrainingVideo = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [TRAINING_VIDEOS_QUERY_KEY, id],
    queryFn: () => getTrainingVideo(id),
    enabled: enabled && !!id,
  });
};

// Create Training Video
const createTrainingVideo = async (payload: CreateTrainingVideoDto): Promise<TrainingVideo> => {
  const { data } = await api.post('/training-videos', payload);
  return data;
};

export const useCreateTrainingVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrainingVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRAINING_VIDEOS_QUERY_KEY] });
    },
  });
};

// Update Training Video (Assuming standard endpoint exists for completeness, though not explicitly requested yet)
const updateTrainingVideo = async ({ id, payload }: { id: string; payload: Partial<CreateTrainingVideoDto> }): Promise<TrainingVideo> => {
  const { data } = await api.patch(`/training-videos/${id}`, payload);
  return data;
};

export const useUpdateTrainingVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTrainingVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRAINING_VIDEOS_QUERY_KEY] });
    },
  });
};

// Delete Training Video
const deleteTrainingVideo = async (id: string): Promise<void> => {
  await api.delete(`/training-videos/${id}`);
};

export const useDeleteTrainingVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTrainingVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRAINING_VIDEOS_QUERY_KEY] });
    },
  });
};
