
export enum Category {
  BEVERAGES = 'Beverages',
  FOOD = 'Food',
  DESSERT = 'Dessert',
  MERCHANDISE = 'Merchandise'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number; // For profit analysis
  category: Category;
  stock: number;
  minStock: number; // For low stock alerts
  image: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  cost: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  profit: number;
  timestamp: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  staffId: string;
  status: 'completed' | 'cancelled';
}

export interface Staff {
  id: string;
  name: string;
  role: 'Admin' | 'Barista' | 'Manager';
  isClockedIn: boolean;
  lastClockIn?: number;
}

export interface StoreConfig {
  name: string;
  currency: string;
  taxRate: number;
}

export type View = 'dashboard' | 'pos' | 'inventory' | 'reports' | 'staff' | 'ai-insights' | 'settings' | 'orders';
