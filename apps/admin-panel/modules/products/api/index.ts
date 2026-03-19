import { apiClient } from "@/lib/api-client";
import type { Product, ProductFormData } from "../types";

/**
 * Products API 客戶端
 */

export async function getProducts() {
  return apiClient.get<Product[]>('/api/products');
}

export async function getProductById(id: string) {
  return apiClient.get<Product>(`/api/products/${id}`);
}

export async function createProduct(data: ProductFormData) {
  return apiClient.post<Product>('/api/products', data);
}

export async function updateProduct(id: string, data: Partial<ProductFormData>) {
  return apiClient.put<Product>(`/api/products/${id}`, data);
}

export async function deleteProduct(id: string) {
  return apiClient.delete(`/api/products/${id}`);
}
