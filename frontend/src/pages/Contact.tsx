import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiWhatsapp } from 'react-icons/si';

const OPENING_HOURS = [
  { day: 'Monday – Friday', hours: '11:00 AM – 11:00 PM' },
  { day: 'Saturday', hours: '10:00 AM – 11:30 PM' },
  { day: 'Sunday', hours: '10:00 AM – 11:30 PM' },
];

export default function Contact() {
  return (
    <main className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-maroon mb-2">Contact & Location</h1>
        <div className="ornament-divider w-48 mx-auto"><span className="text-gold text-lg">✦</span></div>
        <p className="text-muted-foreground font-body mt-2">We'd love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="space-y-4">
          {/* Address */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="font-display text-xl font-bold text-maroon mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-saffron" /> Our Location
            </h2>
            <p className="font-body text-foreground/80 leading-relaxed mb-4">
              The Swad Restaurant<br />
              123, MG Road, Connaught Place<br />
              New Delhi – 110001<br />
              India
            </p>
            <a
              href="https://maps.google.com/?q=Connaught+Place+New+Delhi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-saffron text-sm font-body font-medium hover:underline"
            >
              <ExternalLink className="w-4 h-4" /> Open in Google Maps
            </a>
          </div>

          {/* Opening Hours */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="font-display text-xl font-bold text-maroon mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-saffron" /> Opening Hours
            </h2>
            <div className="space-y-2">
              {OPENING_HOURS.map(({ day, hours }) => (
                <div key={day} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="font-body text-sm text-foreground/80">{day}</span>
                  <span className="font-body text-sm font-semibold text-maroon">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="font-display text-xl font-bold text-maroon mb-4">Get in Touch</h2>
            <div className="space-y-3">
              <a href="tel:+911234567890" className="block">
                <Button className="w-full bg-maroon text-cream hover:bg-maroon/90 justify-start gap-3">
                  <Phone className="w-4 h-4" />
                  <div className="text-left">
                    <p className="text-xs opacity-70">Call Us</p>
                    <p className="font-semibold">+91 12345 67890</p>
                  </div>
                </Button>
              </a>
              <a href="https://wa.me/911234567890?text=Hello%20The%20Swad%20Restaurant!" target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-green-600 text-white hover:bg-green-700 justify-start gap-3">
                  <SiWhatsapp className="w-4 h-4" />
                  <div className="text-left">
                    <p className="text-xs opacity-70">WhatsApp</p>
                    <p className="font-semibold">Chat with Us</p>
                  </div>
                </Button>
              </a>
              <a href="mailto:info@theswadrestaurant.com" className="block">
                <Button variant="outline" className="w-full border-maroon text-maroon hover:bg-maroon/5 justify-start gap-3">
                  <Mail className="w-4 h-4" />
                  <div className="text-left">
                    <p className="text-xs opacity-70">Email Us</p>
                    <p className="font-semibold">info@theswadrestaurant.com</p>
                  </div>
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50">
            <div className="p-4 border-b border-border/50">
              <h2 className="font-display text-xl font-bold text-maroon flex items-center gap-2">
                <MapPin className="w-5 h-5 text-saffron" /> Find Us on Map
              </h2>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9!2d77.2195!3d28.6315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sConnaught%20Place%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Swad Restaurant Location"
            />
          </div>

          {/* Notifications Banner */}
          <div className="bg-gradient-to-br from-maroon/10 to-saffron/10 rounded-2xl p-6 border border-gold/20">
            <h3 className="font-display text-lg font-bold text-maroon mb-2">🔔 Stay Updated</h3>
            <p className="text-sm font-body text-muted-foreground mb-3">
              Follow us for special discounts, festival offers, and new menu updates!
            </p>
            <div className="flex flex-wrap gap-2">
              {['🎉 Weekend 20% Off', '🪔 Festival Specials', '🆕 New Dishes Weekly'].map(tag => (
                <span key={tag} className="text-xs bg-white/60 border border-gold/30 text-maroon px-3 py-1 rounded-full font-body font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
