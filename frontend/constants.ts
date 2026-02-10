
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Cutting Chai', price: 25.00, cost: 8.00, category: Category.BEVERAGES, stock: 200, minStock: 30, image: 'https://images.unsplash.com/photo-1594631252845-29fc4586d51c?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: '2', name: 'Bun Maska', price: 45.00, cost: 15.00, category: Category.FOOD, stock: 40, minStock: 10, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: '3', name: 'Mumbai Vada Pav', price: 35.00, cost: 12.00, category: Category.FOOD, stock: 50, minStock: 15, image: 'https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: '4', name: 'Filter Coffee', price: 60.00, cost: 20.00, category: Category.BEVERAGES, stock: 100, minStock: 20, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: '5', name: 'Cheese Chili Toast', price: 120.00, cost: 45.00, category: Category.FOOD, stock: 30, minStock: 8, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: '6', name: 'Cold Coffee with Ice Cream', price: 150.00, cost: 60.00, category: Category.BEVERAGES, stock: 25, minStock: 5, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: '7', name: 'Peri Peri Fries', price: 110.00, cost: 40.00, category: Category.FOOD, stock: 60, minStock: 10, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=200&h=200&auto=format&fit=crop' },
  { id: '8', name: 'Gulab Jamun (2pcs)', price: 80.00, cost: 30.00, category: Category.DESSERT, stock: 20, minStock: 5, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=200&h=200&auto=format&fit=crop' },
];
