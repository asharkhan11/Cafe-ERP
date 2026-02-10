import { Product, Order, Staff, StoreConfig } from '../types';

const API = 'http://127.0.0.1:3001';

export class DataEngine {

  // ---------- PRODUCTS ----------

  static async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API}/products`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getProducts error:', err);
      return [];
    }
  }

  static async updateProduct(product: Product): Promise<void> {
    try {
      await fetch(`${API}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
    } catch (err) {
      console.error('updateProduct error:', err);
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    try {
      await fetch(`${API}/products/${productId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('deleteProduct error:', err);
    }
  }

  // ---------- ORDERS ----------

  static async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API}/orders`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getOrders error:', err);
      return [];
    }
  }

  static async saveOrder(order: Order): Promise<void> {
    try {
      await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    } catch (err) {
      console.error('saveOrder error:', err);
    }
  }

  static async cancelOrder(orderId: string): Promise<void> {
    try {
      await fetch(`${API}/orders/cancel/${orderId}`, {
        method: 'PUT'
      });
    } catch (err) {
      console.error('cancelOrder error:', err);
    }
  }

  // ---------- STAFF ----------

  static async getStaff(): Promise<Staff[]> {
    try {
      const res = await fetch(`${API}/staff`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getStaff error:', err);
      return [];
    }
  }

  static async toggleClock(staffId: string): Promise<Staff[]> {
    try {
      await fetch(`${API}/staff/toggle/${staffId}`, {
        method: 'PUT'
      });
    } catch (err) {
      console.error('toggleClock error:', err);
    }

    return this.getStaff();
  }

  // ---------- CONFIG ----------

  static async getConfig(): Promise<StoreConfig> {
    const res = await fetch(`${API}/config`);
    return await res.json();
  }


  static async saveConfig(config: StoreConfig): Promise<void> {
    await fetch(`${API}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
  }

}
