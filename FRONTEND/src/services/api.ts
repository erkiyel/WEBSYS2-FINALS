import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getStatus: () => api.get('/auth/status'),
  getElements: () => api.get('/auth/elements'),
};

export const shopInventoryAPI = {
  getAll: () => api.get('/shop-inventory'),
  getStats: () => api.get('/shop-inventory/stats/overview'),
  update: (id: number, data: any) => api.put(`/shop-inventory/${id}`, data),
  delete: (id: number) => api.delete(`/shop-inventory/${id}`),
};

export const ordersAPI = {
  getAll: (status?: string) => api.get(`/orders${status ? `?status=${status}` : ''}`),
  accept: (id: number) => api.put(`/orders/${id}/accept`),
  decline: (id: number) => api.put(`/orders/${id}/decline`),
  getDetail: (id: number) => api.get(`/orders/detail/${id}`),
};

export const sellerOrdersAPI = {
  getAll: (status?: string) => api.get(`/seller-orders${status ? `?status=${status}` : ''}`),
  create: (data: any) => api.post('/seller-orders', data),
  cancel: (id: number) => api.put(`/seller-orders/${id}/cancel`),
};

export const specialistsAPI = {
  getAll: () => api.get('/specialists'),
  getInventory: (id?: number) => {
    if (id) {
      return api.get(`/specialists/${id}/inventory`);
    }
    return api.get('/specialists/me/inventory');
  },
  getMyProfile: () => api.get('/specialists/me/profile'),
  addInventory: (data: any) => api.post('/specialists/me/inventory', data),
  updateInventory: (id: number, data: any) => api.put(`/specialists/me/inventory/${id}`, data),
  addStock: (id: number, data: any) => api.put(`/specialists/me/inventory/${id}/add-stock`, data),
  deleteInventory: (id: number) => api.delete(`/specialists/me/inventory/${id}`),
};

export const scrollsAPI = {
  getAll: (params?: any) => api.get('/scrolls/shop/available', { params }),
  getAllScrolls: (params?: any) => api.get('/scrolls', { params }),
  getFilters: () => api.get('/scrolls/filters/elements'),
  getRarities: () => api.get('/scrolls/filters/rarities'),
};