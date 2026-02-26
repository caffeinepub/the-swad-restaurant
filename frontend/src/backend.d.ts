import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Dish {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    category: string;
    isVeg: boolean;
    price: bigint;
}
export type Time = bigint;
export interface Reservation {
    id: bigint;
    date: string;
    name: string;
    time: string;
    user: Principal;
    timestamp: Time;
    phone: string;
    guests: bigint;
}
export interface Coupon {
    code: string;
    discount: bigint;
}
export interface Order {
    id: bigint;
    status: string;
    paymentMethod: string;
    user: Principal;
    totalAmount: bigint;
    timestamp: Time;
    items: Array<[string, bigint, bigint]>;
}
export interface UserProfile {
    name: string;
    address: string;
}
export interface Review {
    user: Principal;
    comment: string;
    timestamp: Time;
    rating: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCoupon(code: string, discount: bigint): Promise<void>;
    addDish(name: string, description: string, price: bigint, category: string, imageUrl: string, isVeg: boolean, available: boolean): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDish(id: bigint): Promise<void>;
    editDish(id: bigint, name: string, description: string, price: bigint, category: string, imageUrl: string, isVeg: boolean, available: boolean): Promise<void>;
    generateMenuCode(): Promise<string>;
    getAllDishes(): Promise<Array<Dish>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllReviews(): Promise<Array<Review>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDishesByCategory(category: string): Promise<Array<Dish>>;
    getUserOrders(user: Principal): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserReservations(user: Principal): Promise<Array<Reservation>>;
    getVegDishes(): Promise<Array<Dish>>;
    isCallerAdmin(): Promise<boolean>;
    makeReservation(name: string, phone: string, date: string, time: string, guests: bigint): Promise<bigint>;
    placeOrder(items: Array<[string, bigint, bigint]>, totalAmount: bigint, paymentMethod: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    storeImage(blob: ExternalBlob): Promise<ExternalBlob>;
    submitReview(rating: bigint, comment: string): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    validateCoupon(code: string): Promise<Coupon | null>;
    verifyMenuCode(code: string, inputText: string): Promise<[boolean, string]>;
}
