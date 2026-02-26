import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dish } from '../backend';

export interface CartItem {
  dish: Dish;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (dish: Dish) => void;
  removeItem: (dishId: bigint) => void;
  updateQuantity: (dishId: bigint, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: string | null;
  applyDiscount: (couponCode: string, discountPercent: number) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const addItem = (dish: Dish) => {
    setItems(prev => {
      const existing = prev.find(i => i.dish.id === dish.id);
      if (existing) {
        return prev.map(i => i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const removeItem = (dishId: bigint) => {
    setItems(prev => prev.filter(i => i.dish.id !== dishId));
  };

  const updateQuantity = (dishId: bigint, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId);
      return;
    }
    setItems(prev => prev.map(i => i.dish.id === dishId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(0);
    setAppliedCoupon(null);
  };

  const applyDiscount = (couponCode: string, discountPercent: number) => {
    setAppliedCoupon(couponCode);
    setDiscount(discountPercent);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.dish.price) * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discount / 100);
  const total = subtotal - discountAmount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, subtotal, discount, total, appliedCoupon,
      applyDiscount, removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
