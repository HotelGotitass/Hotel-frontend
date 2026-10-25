import React from 'react';
import {
  Wifi, Tv, Snowflake, AirVent, Coffee, Croissant, UtensilsCrossed, Car, Bath, ShowerHead, Waves, Dumbbell,
  Wine, Lock, Phone, Mountain, BedDouble, PawPrint, Accessibility, ConciergeBell, Shirt, Flower2, Baby,
  CigaretteOff, Refrigerator, Fan, Sun, Sparkles, Check,
} from 'lucide-react';

/**
 * Catalogo de iconos para comodidades. Se guarda la clave (p. ej. "wifi") en amenities.icon.
 * Iconos antiguos escritos a mano (emoji o texto) se siguen mostrando tal cual.
 */
export const AMENITY_ICONS = [
  { key: 'wifi', Icon: Wifi },
  { key: 'tv', Icon: Tv },
  { key: 'ac', Icon: Snowflake },
  { key: 'ventilation', Icon: AirVent },
  { key: 'fan', Icon: Fan },
  { key: 'breakfast', Icon: Croissant },
  { key: 'coffee', Icon: Coffee },
  { key: 'restaurant', Icon: UtensilsCrossed },
  { key: 'minibar', Icon: Wine },
  { key: 'fridge', Icon: Refrigerator },
  { key: 'bathtub', Icon: Bath },
  { key: 'shower', Icon: ShowerHead },
  { key: 'pool', Icon: Waves },
  { key: 'gym', Icon: Dumbbell },
  { key: 'spa', Icon: Flower2 },
  { key: 'parking', Icon: Car },
  { key: 'safe', Icon: Lock },
  { key: 'phone', Icon: Phone },
  { key: 'view', Icon: Mountain },
  { key: 'terrace', Icon: Sun },
  { key: 'king_bed', Icon: BedDouble },
  { key: 'room_service', Icon: ConciergeBell },
  { key: 'laundry', Icon: Shirt },
  { key: 'pets', Icon: PawPrint },
  { key: 'kids', Icon: Baby },
  { key: 'accessible', Icon: Accessibility },
  { key: 'non_smoking', Icon: CigaretteOff },
  { key: 'cleaning', Icon: Sparkles },
];

const BY_KEY = Object.fromEntries(AMENITY_ICONS.map((i) => [i.key, i.Icon]));

export function AmenityIcon({ icon, size = 18, className = '' }) {
  const Icon = icon && BY_KEY[icon];
  if (Icon) return <Icon size={size} strokeWidth={1.6} className={className} aria-hidden="true" />;
  // Emoji o texto corto heredado
  if (icon && icon.length <= 4) return <span className={className} style={{ fontSize: size }} aria-hidden="true">{icon}</span>;
  return <Check size={size} strokeWidth={1.6} className={className} aria-hidden="true" />;
}
