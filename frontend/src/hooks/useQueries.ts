import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Dish, Order, Reservation, Review, UserProfile, Coupon } from '../backend';

// ─── Dishes ───────────────────────────────────────────────────────────────────

export function useGetAllDishes() {
  const { actor, isFetching } = useActor();
  return useQuery<Dish[]>({
    queryKey: ['dishes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDishes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDishesByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Dish[]>({
    queryKey: ['dishes', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDishesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVegDishes() {
  const { actor, isFetching } = useActor();
  return useQuery<Dish[]>({
    queryKey: ['dishes', 'veg'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVegDishes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDish() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string; description: string; price: bigint;
      category: string; imageUrl: string; isVeg: boolean; available: boolean;
    }) => {
      if (!actor) throw new Error('Not connected');
      return actor.addDish(params.name, params.description, params.price, params.category, params.imageUrl, params.isVeg, params.available);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dishes'] }),
  });
}

export function useEditDish() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint; name: string; description: string; price: bigint;
      category: string; imageUrl: string; isVeg: boolean; available: boolean;
    }) => {
      if (!actor) throw new Error('Not connected');
      return actor.editDish(params.id, params.name, params.description, params.price, params.category, params.imageUrl, params.isVeg, params.available);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dishes'] }),
  });
}

export function useDeleteDish() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Not connected');
      return actor.deleteDish(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dishes'] }),
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function usePlaceOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      items: Array<[string, bigint, bigint]>;
      totalAmount: bigint;
      paymentMethod: string;
    }) => {
      if (!actor) throw new Error('Not connected');
      return actor.placeOrder(params.items, params.totalAmount, params.paymentMethod);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useGetUserOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Order[]>({
    queryKey: ['orders', 'user', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserOrders(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: bigint; status: string }) => {
      if (!actor) throw new Error('Not connected');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

// ─── Reservations ─────────────────────────────────────────────────────────────

export function useMakeReservation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string; phone: string; date: string; time: string; guests: bigint;
    }) => {
      if (!actor) throw new Error('Not connected');
      return actor.makeReservation(params.name, params.phone, params.date, params.time, params.guests);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });
}

export function useGetUserReservations() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Reservation[]>({
    queryKey: ['reservations', 'user', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserReservations(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function useGetAllReviews() {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ rating, comment }: { rating: bigint; comment: string }) => {
      if (!actor) throw new Error('Not connected');
      return actor.submitReview(rating, comment);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews'] }),
  });
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export function useValidateCoupon() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (code: string): Promise<Coupon | null> => {
      if (!actor) throw new Error('Not connected');
      return actor.validateCoupon(code);
    },
  });
}

export function useAddCoupon() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ code, discount }: { code: string; discount: bigint }) => {
      if (!actor) throw new Error('Not connected');
      return actor.addCoupon(code, discount);
    },
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !!identity && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Not connected');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['currentUserProfile'] }),
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
