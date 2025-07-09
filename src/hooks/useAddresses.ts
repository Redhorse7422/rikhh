import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import { useApi } from '@/hooks/useApi'
import {
  createAddress,
  updateAddress,
  deleteAddress,
  type Address,
  type AddressesResponse,
  type CreateAddressDto,
  type UpdateAddressDto,
} from '@/services/addresses.services'

export const useAddresses = () => {
  const queryClient = useQueryClient()
  const { getDataSource } = useApi()
  const { data: session } = useSession()

  // Only fetch addresses if user is authenticated
  const isAuthenticated = !!session?.user

  // Use getDataSource for addresses - only enabled for authenticated users
  const { data, isLoading, error, refetch } = getDataSource<AddressesResponse>({
    path: '/v1/checkout/addresses',
    query: {},
    enabled: isAuthenticated, // Only enable the query for authenticated users
  })

  // Mutations - only available for authenticated users
  const createAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['get-/v1/checkout/addresses', {}, undefined] })
      }
    },
  })

  const updateAddressMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['get-/v1/checkout/addresses', {}, undefined] })
      }
    },
  })

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['get-/v1/checkout/addresses', {}, undefined] })
      }
    },
  })

  // Helper functions
  const shippingAddresses = isAuthenticated ? (data?.shipping || []) : []
  const billingAddresses = isAuthenticated ? (data?.billing || []) : []
  const allAddresses = [...shippingAddresses, ...billingAddresses]

  const getShippingAddresses = () => shippingAddresses
  const getBillingAddresses = () => billingAddresses
  const getDefaultShippingAddress = () => shippingAddresses.find((address: Address) => address.isDefault)
  const getDefaultBillingAddress = () => billingAddresses.find((address: Address) => address.isDefault)

  return {
    addresses: allAddresses,
    shippingAddresses,
    billingAddresses,
    isLoading: isAuthenticated ? isLoading : false, // No loading for guests
    error: isAuthenticated ? error : null, // No error for guests
    refetch: isAuthenticated ? refetch : () => Promise.resolve(), // No-op for guests
    createAddress: isAuthenticated ? createAddressMutation.mutate : () => {}, // No-op for guests
    updateAddress: isAuthenticated ? updateAddressMutation.mutate : () => {}, // No-op for guests
    deleteAddress: isAuthenticated ? deleteAddressMutation.mutate : () => {}, // No-op for guests
    isCreating: isAuthenticated ? createAddressMutation.isPending : false,
    isUpdating: isAuthenticated ? updateAddressMutation.isPending : false,
    isDeleting: isAuthenticated ? deleteAddressMutation.isPending : false,
    getShippingAddresses,
    getBillingAddresses,
    getDefaultShippingAddress,
    getDefaultBillingAddress,
    isAuthenticated, // Expose authentication status for components to use
  }
}
