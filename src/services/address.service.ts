import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  fullName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  isDefault?: boolean;
}

export interface AddressValidationResponse {
  isValid: boolean;
  formattedAddress?: Address;
  suggestions?: Address[];
  errors?: string[];
}

export class AddressService {
  /**
   * Get all user addresses
   */
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get<Address[]>(API_ENDPOINTS.ADDRESSES);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch addresses');
  }

  /**
   * Create new address
   */
  async createAddress(address: CreateAddressRequest): Promise<Address> {
    const response = await apiClient.post<Address>(API_ENDPOINTS.ADDRESSES, address);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to create address');
  }

  /**
   * Update existing address
   */
  async updateAddress(id: string, address: UpdateAddressRequest): Promise<Address> {
    const response = await apiClient.patch<Address>(API_ENDPOINTS.ADDRESS_BY_ID(id), address);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to update address');
  }

  /**
   * Delete address
   */
  async deleteAddress(id: string): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.ADDRESS_BY_ID(id));
    
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(response.message || 'Failed to delete address');
    }
  }

  /**
   * Set address as default
   */
  async setDefaultAddress(id: string): Promise<Address[]> {
    const response = await apiClient.post<Address[]>(API_ENDPOINTS.SET_DEFAULT_ADDRESS(id));
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to set default address');
  }

  /**
   * Get address by ID
   */
  async getAddressById(id: string): Promise<Address> {
    const response = await apiClient.get<Address>(API_ENDPOINTS.ADDRESS_BY_ID(id));
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch address');
  }

  /**
   * Validate address
   */
  async validateAddress(address: CreateAddressRequest | UpdateAddressRequest): Promise<AddressValidationResponse> {
    const response = await apiClient.post<AddressValidationResponse>(`${API_ENDPOINTS.ADDRESSES}/validate`, address);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to validate address');
  }

  /**
   * Get address suggestions
   */
  async getAddressSuggestions(query: string): Promise<Address[]> {
    const response = await apiClient.get<Address[]>(`${API_ENDPOINTS.ADDRESSES}/suggestions`, {
      q: query
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get address suggestions');
  }

  /**
   * Get countries list
   */
  async getCountries(): Promise<{ code: string; name: string }[]> {
    const response = await apiClient.get<{ code: string; name: string }[]>(`${API_ENDPOINTS.ADDRESSES}/countries`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch countries');
  }

  /**
   * Get states/provinces for a country
   */
  async getStates(countryCode: string): Promise<{ code: string; name: string }[]> {
    const response = await apiClient.get<{ code: string; name: string }[]>(`${API_ENDPOINTS.ADDRESSES}/states`, {
      country: countryCode
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch states');
  }

  /**
   * Get cities for a state/province
   */
  async getCities(countryCode: string, stateCode: string): Promise<string[]> {
    const response = await apiClient.get<string[]>(`${API_ENDPOINTS.ADDRESSES}/cities`, {
      country: countryCode,
      state: stateCode
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to fetch cities');
  }

  /**
   * Calculate shipping cost for address
   */
  async calculateShippingCost(addressId: string, cartValue?: number): Promise<{
    standard: { cost: number; days: string };
    express: { cost: number; days: string };
    overnight?: { cost: number; days: string };
  }> {
    const params: any = { addressId };
    if (cartValue) params.cartValue = cartValue;
    
    const response = await apiClient.get<{
      standard: { cost: number; days: string };
      express: { cost: number; days: string };
      overnight?: { cost: number; days: string };
    }>(`${API_ENDPOINTS.ADDRESSES}/shipping-cost`, params);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to calculate shipping cost');
  }

  /**
   * Check if address is in serviceable area
   */
  async checkServiceability(address: CreateAddressRequest): Promise<{
    isServiceable: boolean;
    estimatedDelivery: string;
    availableShippingMethods: string[];
  }> {
    const response = await apiClient.post<{
      isServiceable: boolean;
      estimatedDelivery: string;
      availableShippingMethods: string[];
    }>(`${API_ENDPOINTS.ADDRESSES}/check-serviceability`, address);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to check serviceability');
  }

  /**
   * Get default address
   */
  async getDefaultAddress(): Promise<Address | null> {
    const addresses = await this.getAddresses();
    const defaultAddress = addresses.find(address => address.isDefault);
    return defaultAddress || null;
  }

  /**
   * Duplicate address with new ID
   */
  async duplicateAddress(id: string, modifications?: Partial<UpdateAddressRequest>): Promise<Address> {
    const originalAddress = await this.getAddressById(id);
    const duplicatedAddress: CreateAddressRequest = {
      fullName: originalAddress.fullName,
      addressLine1: originalAddress.addressLine1,
      addressLine2: originalAddress.addressLine2,
      city: originalAddress.city,
      state: originalAddress.state,
      postalCode: originalAddress.postalCode,
      country: originalAddress.country,
      phoneNumber: originalAddress.phoneNumber,
      isDefault: false,
      ...modifications
    };

    return this.createAddress(duplicatedAddress);
  }
}

export const addressService = new AddressService();
