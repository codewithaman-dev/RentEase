import { Product } from '../types';

export function getProductImage(product?: Product | null): string {
  if (!product) {
    return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
  }

  if (product.image && typeof product.image === 'string' && product.image.startsWith('http')) {
    return product.image;
  }

  if (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0].startsWith('http')) {
    return product.images[0];
  }

  if (typeof product.images === 'string' && (product.images as string).startsWith('http')) {
    return product.images as string;
  }

  return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
}
