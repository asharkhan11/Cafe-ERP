
import { Product, Order, Staff, StoreConfig, Category } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

const DELAY = 50; // Reduced for near-instant feedback

export class DataEngine {
  private static async delay() {
    return new Promise(resolve => setTimeout(resolve, DELAY));
  }

  static async getProducts(): Promise<Product[]> {
    await this.delay();
    const data = localStorage.getItem('bp_products');
    if (!data || data === 'undefined') {
      localStorage.setItem('bp_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      localStorage.setItem('bp_products', JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
  }

  static async updateProduct(product: Product): Promise<void> {
    await this.delay();
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
      products[index] = { ...product };
    } else {
      const newProduct = { ...product };
      if (!newProduct.id || newProduct.id === '') {
        newProduct.id = Math.random().toString(36).substr(2, 9);
      }
      products.push(newProduct);
    }
    localStorage.setItem('bp_products', JSON.stringify(products));
  }

  static async deleteProduct(productId: string): Promise<void> {
    await this.delay();
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== productId);
    localStorage.setItem('bp_products', JSON.stringify(filtered));
  }

  static async getOrders(): Promise<Order[]> {
    await this.delay();
    const data = localStorage.getItem('bp_orders');
    const orders: Order[] = data ? JSON.parse(data) : [];
    return orders.sort((a, b) => b.timestamp - a.timestamp);
  }

  static async saveOrder(order: Order): Promise<void> {
    await this.delay();
    const orders = await this.getOrders();
    orders.push(order);
    localStorage.setItem('bp_orders', JSON.stringify(orders));

    const products = await this.getProducts();
    order.items.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) p.stock = Math.max(0, p.stock - item.quantity);
    });
    localStorage.setItem('bp_products', JSON.stringify(products));
  }

  static async cancelOrder(orderId: string): Promise<Order[]> {
    await this.delay();
    const orders = await this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order && order.status !== 'cancelled') {
      order.status = 'cancelled';
      const products = await this.getProducts();
      order.items.forEach(item => {
        const p = products.find(prod => prod.id === item.productId);
        if (p) p.stock += item.quantity;
      });
      localStorage.setItem('bp_products', JSON.stringify(products));
      localStorage.setItem('bp_orders', JSON.stringify(orders));
    }
    return orders;
  }

  static async getStaff(): Promise<Staff[]> {
    await this.delay();
    const data = localStorage.getItem('bp_staff');
    if (!data) {
      const initial: Staff[] = [
        { id: 's1', name: 'Rahul Sharma', role: 'Manager', isClockedIn: false },
        { id: 's2', name: 'Priya Nair', role: 'Barista', isClockedIn: false }
      ];
      localStorage.setItem('bp_staff', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  static async toggleClock(staffId: string): Promise<Staff[]> {
    const staff = await this.getStaff();
    const member = staff.find(s => s.id === staffId);
    if (member) {
      member.isClockedIn = !member.isClockedIn;
      member.lastClockIn = member.isClockedIn ? Date.now() : member.lastClockIn;
    }
    localStorage.setItem('bp_staff', JSON.stringify(staff));
    return staff;
  }

  static async getConfig(): Promise<StoreConfig> {
    const data = localStorage.getItem('bp_config');
    if (!data) {
      const config: StoreConfig = { 
        name: 'Mumbai Brew Co.', 
        currency: '₹', 
        taxRate: 0.05 
      };
      localStorage.setItem('bp_config', JSON.stringify(config));
      return config;
    }
    return JSON.parse(data);
  }
}
