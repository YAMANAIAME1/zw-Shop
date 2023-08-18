import type { AddressItem } from '@/types/address'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStroe = defineStore('address', () => {
  // 地址信息
  const addressDetail = ref<AddressItem>()

  const setAddressDetail = (val: AddressItem) => {
    addressDetail.value = val
  }

  return {
    addressDetail,
    setAddressDetail,
  }
})
