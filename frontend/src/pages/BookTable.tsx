import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useMakeReservation } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Loader2, CalendarDays, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import LoginButton from '../components/LoginButton';

const TIME_SLOTS = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM',
];

export default function BookTable() {
  const { identity } = useInternetIdentity();
  const makeReservation = useMakeReservation();

  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', guests: '2' });
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId, setReservationId] = useState<bigint | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time || !form.guests) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    try {
      const id = await makeReservation.mutateAsync({
        name: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
        guests: BigInt(form.guests),
      });
      setReservationId(id);
      setConfirmed(true);
    } catch {
      toast.error('Failed to make reservation. Please try again.');
    }
  };

  if (confirmed) {
    return (
      <main className="page-enter max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-maroon mb-2">Table Reserved!</h2>
          <p className="text-muted-foreground font-body mb-1">Booking #{String(reservationId)} confirmed</p>
          <div className="bg-muted/50 rounded-xl p-4 mt-4 text-left space-y-2 text-sm font-body">
            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{form.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{form.date}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{form.time}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{form.guests}</span></div>
          </div>
          <Button
            onClick={() => { setConfirmed(false); setForm({ name: '', phone: '', date: '', time: '', guests: '2' }); }}
            className="mt-6 bg-maroon text-cream hover:bg-maroon/90"
          >
            Make Another Booking
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="w-8 h-8 text-maroon" />
        </div>
        <h1 className="font-display text-3xl font-bold text-maroon mb-2">Book a Table</h1>
        <div className="ornament-divider w-48 mx-auto"><span className="text-gold text-lg">✦</span></div>
        <p className="text-muted-foreground font-body mt-2">Reserve your spot for an unforgettable dining experience</p>
      </div>

      {!identity ? (
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50 text-center">
          <LogIn className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-maroon mb-2">Login Required</h3>
          <p className="text-muted-foreground font-body mb-6">Please login to make a table reservation</p>
          <LoginButton />
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="res-name">Full Name *</Label>
                <Input
                  id="res-name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="res-phone">Phone Number *</Label>
                <Input
                  id="res-phone"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="10-digit mobile number"
                  type="tel"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="res-date">Date *</Label>
                <Input
                  id="res-date"
                  type="date"
                  value={form.date}
                  min={today}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Time *</Label>
                <Select value={form.time} onValueChange={v => setForm(f => ({ ...f, time: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Number of Guests *</Label>
              <Select value={form.guests} onValueChange={v => setForm(f => ({ ...f, guests: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(n => (
                    <SelectItem key={n} value={String(n)}>{n} {n === 1 ? 'Guest' : 'Guests'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 text-sm font-body text-muted-foreground">
              <p className="font-medium text-foreground mb-1">📋 Reservation Policy</p>
              <ul className="space-y-1 text-xs list-disc list-inside">
                <li>Please arrive 10 minutes before your booking time</li>
                <li>Reservations are held for 15 minutes past booking time</li>
                <li>For groups larger than 20, please call us directly</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={makeReservation.isPending}
              className="w-full bg-maroon text-cream hover:bg-maroon/90 font-semibold py-3 text-base"
            >
              {makeReservation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirming...</>
              ) : (
                'Confirm Reservation'
              )}
            </Button>
          </form>
        </div>
      )}
    </main>
  );
}
