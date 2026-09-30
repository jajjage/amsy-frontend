/**
 * Admin Supplier Service
 * API methods for supplier management based on ADMIN_GUIDE.md
 */

import apiClient from "@/lib/api-client";
import {
  CreateSupplierRequest,
  Supplier,
  SupplierListResponse,
  UpdateSupplierRequest,
  SupplierBalancesResponse,
} from "@/types/admin/supplier.types";
import { ApiResponse } from "@/types/api.types";

const BASE_PATH = "/admin/suppliers";

export const adminSupplierService = {
  /**
   * Get all suppliers
   */
  getSuppliers: async (): Promise<ApiResponse<SupplierListResponse>> => {
    const response =
      await apiClient.get<ApiResponse<SupplierListResponse>>(BASE_PATH);
    return response.data;
  },

  /**
   * Get a single supplier by ID
   */
  getSupplierById: async (
    supplierId: string
  ): Promise<ApiResponse<Supplier>> => {
    const response = await apiClient.get<ApiResponse<Supplier>>(
      `${BASE_PATH}/${supplierId}`
    );
    return response.data;
  },

  /**
   * Create a new supplier
   */
  createSupplier: async (
    data: CreateSupplierRequest
  ): Promise<ApiResponse<{ supplier: Supplier }>> => {
    const response = await apiClient.post<ApiResponse<{ supplier: Supplier }>>(
      BASE_PATH,
      data
    );
    return response.data;
  },

  /**
   * Update a supplier
   */
  updateSupplier: async (
    supplierId: string,
    data: UpdateSupplierRequest
  ): Promise<ApiResponse<{ supplier: Supplier }>> => {
    const response = await apiClient.put<ApiResponse<{ supplier: Supplier }>>(
      `${BASE_PATH}/${supplierId}`,
      data
    );
    return response.data;
  },

  getSupplierBalances: async (): Promise<ApiResponse<SupplierBalancesResponse>> => {
    const response = await apiClient.get<ApiResponse<SupplierBalancesResponse>>(`${BASE_PATH}/balances`);
    return response.data;
  },

  refreshSupplierBalance: async (supplier: string) => {
    const response = await apiClient.post<ApiResponse<{ balance: import("@/types/admin/supplier.types").SupplierBalance }>>(`${BASE_PATH}/balances/${supplier}/refresh`);
    return response.data;
  },
};
