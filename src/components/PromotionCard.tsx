import React from 'react';
import { Clock, MapPin, Users, Star, Gift, Calendar } from 'lucide-react';
import { Promotion } from '../data/promotions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PromotionCardProps {
  promotion: Promotion;
  onSelect: (promotion: Promotion) => void;
  className?: string;
}

export function PromotionCard({ promotion, onSelect, className = '' }: PromotionCardProps) {
  const daysLeft = Math.ceil((new Date(promotion.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${className}`}>
      <div className="relative h-64 overflow-hidden">
        <img
          src={promotion.image}
          alt={promotion.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Discount Badge */}
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          -{promotion.discount}%
        </div>
        
        {/* Limited Seats Badge */}
        <div className="absolute top-4 right-4 bg-amarillo-dorado text-azul-oscuro px-3 py-1 rounded-full text-sm font-bold">
          Solo {promotion.limitedSeats} cupos
        </div>
        
        {/* Price */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-azul-oscuro px-4 py-2 rounded-xl">
          <div className="text-xs text-gray-500 line-through">S/ {promotion.originalPrice.toFixed(2)}</div>
          <div className="text-lg font-bold text-red-600">S/ {promotion.discountedPrice.toFixed(2)}</div>
        </div>
        
        {/* Route */}
        <div className="absolute bottom-4 left-4 bg-azul-oscuro/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {promotion.route.origen} → {promotion.route.destino}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-azul-oscuro group-hover:text-amarillo-dorado transition-colors">
            {promotion.title}
          </h3>
          <div className="flex items-center text-amarillo-dorado">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
          </div>
        </div>
        
        <p className="text-gris-suave mb-4 leading-relaxed">
          {promotion.description}
        </p>
        
        {/* Benefits */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-azul-oscuro mb-2 flex items-center">
            <Gift className="h-4 w-4 mr-1" />
            Beneficios incluidos:
          </h4>
          <div className="flex flex-wrap gap-2">
            {promotion.benefits.map((benefit, index) => (
              <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                ✓ {benefit}
              </span>
            ))}
          </div>
        </div>
        
        {/* Validity */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex items-center text-gris-suave">
            <Calendar className="h-4 w-4 mr-1" />
            Válido hasta {format(new Date(promotion.validUntil), 'd MMM yyyy', { locale: es })}
          </div>
          <div className={`font-semibold ${daysLeft <= 7 ? 'text-red-600' : 'text-green-600'}`}>
            {daysLeft} días restantes
          </div>
        </div>
        
        <button
          onClick={() => onSelect(promotion)}
          className="w-full bg-gradient-to-r from-azul-oscuro to-primary-600 text-white py-3 px-6 rounded-xl hover:from-primary-600 hover:to-azul-oscuro transition-all duration-300 font-semibold group-hover:bg-amarillo-dorado group-hover:text-azul-oscuro transform hover:scale-105"
        >
          ¡Reservar Ahora!
        </button>
      </div>
    </div>
  );
}