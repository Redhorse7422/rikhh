import { useMutation, useQueryClient } from '@tanstack/react-query'

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

  // Use getDataSource for addresses
  const { data, isLoading, error, refetch } = getDataSource<AddressesResponse>({
    path: '/v1/checkout/addresses',
    query: {},
    enabled: true,
  })

  // Mutations
  const createAddressMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-/v1/checkout/addresses', {}, undefined] })
    },
  })

  const updateAddressMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-/v1/checkout/addresses', {}, undefined] })
    },
  })

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-/v1/checkout/addresses', {}, undefined] })
    },
  })

  // Helper functions
  const shippingAddresses = data?.shipping || []
  const billingAddresses = data?.billing || []
  const allAddresses = [...shippingAddresses, ...billingAddresses]

  const getShippingAddresses = () => shippingAddresses
  const getBillingAddresses = () => billingAddresses
  const getDefaultShippingAddress = () => shippingAddresses.find((address: Address) => address.isDefault)
  const getDefaultBillingAddress = () => billingAddresses.find((address: Address) => address.isDefault)

  return {
    addresses: allAddresses,
    shippingAddresses,
    billingAddresses,
    isLoading,
    error,
    refetch,
    createAddress: createAddressMutation.mutate,
    updateAddress: updateAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
    isCreating: createAddressMutation.isPending,
    isUpdating: updateAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
    getShippingAddresses,
    getBillingAddresses,
    getDefaultShippingAddress,
    getDefaultBillingAddress,
  }
}
