import React from 'react';
import { Dish } from '../backend';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

const CATEGORY_FALLBACKS: Record<string, string> = {
  'Starters': '/assets/generated/dish-starters.dim_600x400.png',
  'Main Course': '/assets/generated/dish-maincourse.dim_600x400.png',
  'Breads': '/assets/generated/dish-breads.dim_600x400.png',
  'Desserts': '/assets/generated/dish-desserts.dim_600x400.png',
  'Beverages': '/assets/generated/dish-beverages.dim_600x400.png',
};

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.dish.id === dish.id);
  const quantity = cartItem?.quantity ?? 0;

  const imageUrl = dish.imageUrl || CATEGORY_FALLBACKS[dish.category] || '/assets/generated/dish-maincourse.dim_600x400.png';

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card card-hover border border-border/50 flex flex-col">
      <div className="relative h-44 overflow-hidden">
        <img
          src={imageUrl}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = CATEGORY_FALLBACKS[dish.category] || '/assets/generated/dish-maincourse.dim_600x400.png';
          }}
        />
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            dish.isVeg
              ? 'bg-green-50 text-green-700 border border-green-300'
              : 'bg-red-50 text-red-700 border border-red-300'
          }`}>
            <span className={dish.isVeg ? 'veg-dot' : 'nonveg-dot'} />
            {dish.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
        {!dish.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-foreground text-base leading-tight mb-1">{dish.name}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed flex-1 mb-3 line-clamp-2">{dish.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-maroon text-lg font-body">₹{Number(dish.price)}</span>
          {dish.available ? (
            quantity === 0 ? (
              <Button
                size="sm"
                onClick={() => addItem(dish)}
                className="bg-maroon text-cream hover:bg-maroon/90 text-xs px-3 h-8"
              >
                <ShoppingCart className="w-3 h-3 mr-1" /> Add
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(dish.id, quantity - 1)}
                  className="w-7 h-7 rounded-full bg-maroon text-cream flex items-center justify-center hover:bg-maroon/90 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-maroon w-5 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => updateQuantity(dish.id, quantity + 1)}
                  className="w-7 h-7 rounded-full bg-maroon text-cream flex items-center justify-center hover:bg-maroon/90 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
