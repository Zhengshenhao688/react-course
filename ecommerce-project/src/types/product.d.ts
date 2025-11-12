type Rating = { stars: number; count: number };

export type ProductType = {
  id: string;
  image: string;
  name: string;
  rating: Rating;
  priceCents: number;
  keywords?: string[];
  estimatedDeliveryTimeMs?: number; 
};
