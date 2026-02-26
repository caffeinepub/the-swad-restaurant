import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCart } from '../context/CartContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { usePlaceOrder, useValidateCoupon } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, Tag, CheckCircle, Loader2, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, discount, total, appliedCoupon, applyDiscount, removeCoupon } = useCart();
  const { identity } = useInternetIdentity();
  const placeOrder = usePlaceOrder();
  const validateCoupon = useValidateCoupon();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<bigint | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const coupon = await validateCoupon.mutateAsync(couponInput.trim().toUpperCase());
      if (coupon) {
        applyDiscount(coupon.code, Number(coupon.discount));
        toast.success(`Coupon applied! ${Number(coupon.discount)}% off`);
        setCouponInput('');
      } else {
        toast.error('Invalid coupon code');
      }
    } catch {
      toast.error('Failed to validate coupon');
    }
  };

  const handlePlaceOrder = async () => {
    if (!identity) {
      toast.error('Please login to place an order');
      return;
    }
    if (items.length === 0) return;

    try {
      const orderItems: Array<[string, bigint, bigint]> = items.map(item => [
        item.dish.name,
        BigInt(item.quantity),
        item.dish.price,
      ]);
      const id = await placeOrder.mutateAsync({
        items: orderItems,
        totalAmount: BigInt(total),
        paymentMethod,
      });
      setOrderId(id);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <main className="page-enter max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-maroon mb-2">Order Placed!</h2>
          <p className="text-muted-foreground font-body mb-1">Your order #{String(orderId)} has been confirmed.</p>
          <p className="text-muted-foreground font-body text-sm mb-6">We'll prepare your food with love 🍛</p>
          <div className="flex gap-3 justify-center">
            <Link to="/home">
              <Button className="bg-maroon text-cream hover:bg-maroon/90">Back to Home</Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="border-maroon text-maroon">View Orders</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="page-enter max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-maroon mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground font-body mb-6">Add some delicious dishes to get started!</p>
          <Link to="/menu">
            <Button className="bg-maroon text-cream hover:bg-maroon/90">Browse Menu</Button>
          </Link>
        </div>
      </main>
    );
  }

  const discountAmount = Math.round(subtotal * discount / 100);

  return (
    <main className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-maroon mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={String(item.dish.id)} className="bg-card rounded-xl p-4 shadow-card border border-border/50 flex gap-4">
              <img
                src={item.dish.imageUrl || `/assets/generated/dish-${item.dish.category.toLowerCase().replace(' ', '')}.dim_600x400.png`}
                alt={item.dish.name}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = '/assets/generated/dish-maincourse.dim_600x400.png'; }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm leading-tight">{item.dish.name}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.dish.category}</p>
                  </div>
                  <button onClick={() => removeItem(item.dish.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-maroon/10 text-maroon flex items-center justify-center hover:bg-maroon/20 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-maroon w-5 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-maroon/10 text-maroon flex items-center justify-center hover:bg-maroon/20 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="font-bold text-maroon font-body">₹{Number(item.dish.price) * item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-saffron" /> Coupon Code
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <span className="text-green-700 text-sm font-semibold">{appliedCoupon} ({discount}% off)</span>
                <button onClick={removeCoupon} className="text-green-600 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. SWAD10)"
                  className="text-sm"
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={validateCoupon.isPending || !couponInput.trim()}
                  size="sm"
                  className="bg-saffron text-white hover:bg-saffron/90 shrink-0"
                >
                  {validateCoupon.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </Button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
            <h3 className="font-display font-semibold text-foreground mb-3">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
              {[
                { value: 'UPI', label: 'UPI', icon: Smartphone, desc: 'Pay via UPI apps' },
                { value: 'Card', label: 'Card', icon: CreditCard, desc: 'Debit / Credit card' },
                { value: 'Cash', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when delivered' },
              ].map(({ value, label, icon: Icon, desc }) => (
                <div
                  key={value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    paymentMethod === value ? 'border-maroon bg-maroon/5' : 'border-border hover:border-maroon/40'
                  }`}
                  onClick={() => setPaymentMethod(value)}
                >
                  <RadioGroupItem value={value} id={`pay-${value}`} className="text-maroon" />
                  <Icon className="w-4 h-4 text-saffron" />
                  <div>
                    <Label htmlFor={`pay-${value}`} className="font-medium text-sm cursor-pointer">{label}</Label>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Price Summary */}
          <div className="bg-card rounded-xl p-4 shadow-card border border-border/50">
            <h3 className="font-display font-semibold text-foreground mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base text-maroon">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {!identity && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3 font-body">
                Please login to place your order
              </p>
            )}

            <Button
              onClick={handlePlaceOrder}
              disabled={placeOrder.isPending || !identity}
              className="w-full mt-4 bg-maroon text-cream hover:bg-maroon/90 font-semibold"
            >
              {placeOrder.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing Order...</>
              ) : (
                `Place Order • ₹${total}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
