import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, tenureMonths?: 3 | 6 | 12) => void;
  removeFromCart: (productId: string) => void;
  updateTenure: (productId: string, tenureMonths: 3 | 6 | 12) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalMonthlyPrice: number;
  totalDeposit: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateTenure: () => {},
  clearCart: () => {},
  isCartOpen: false,
  setIsCartOpen: () => {},
  totalMonthlyPrice: 0,
  totalDeposit: 0,
  itemCount: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rentease_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('rentease_cart', JSON.stringify(items));
  }, [items]);

  const getMonthlyRate = (product: Product, tenure: 3 | 6 | 12) => {
    if (tenure === 3) return product.monthly_rate_3m;
    if (tenure === 6) return product.monthly_rate_6m;
    return product.monthly_rate_12m;
  };

  const addToCart = (product: Product, tenureMonths: 3 | 6 | 12 = 6) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const rate = getMonthlyRate(product, tenureMonths);
      const deposit = product.deposit_amount || Math.round(rate * 1.5);

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, tenureMonths, monthlyPrice: rate, deposit }
            : item
        );
      }
      return [...prev, { product, tenureMonths, quantity: 1, monthlyPrice: rate, deposit }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateTenure = (productId: string, tenureMonths: 3 | 6 | 12) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const rate = getMonthlyRate(item.product, tenureMonths);
          return { ...item, tenureMonths, monthlyPrice: rate };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalMonthlyPrice = items.reduce((sum, item) => sum + item.monthlyPrice * item.quantity, 0);
  const totalDeposit = items.reduce((sum, item) => sum + item.deposit * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateTenure,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalMonthlyPrice,
        totalDeposit,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
