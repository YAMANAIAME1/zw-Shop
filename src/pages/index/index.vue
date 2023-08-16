<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { ref } from 'vue'
import type { bannerItem, CategoryItem, HotItem } from '@/types/home'

import PageSkeleton from './components/PageSkeleton.vue'
import { useGuessList } from '@/composables'

const bannerList = ref<bannerItem[]>([])
const getHomeBanner = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

const CategoryList = ref<CategoryItem[]>([])
const getHomeCategory = async () => {
  const res = await getHomeCategoryAPI()
  CategoryList.value = res.result
}

const HotList = ref<HotItem[]>([])
const getHomeHot = async () => {
  const res = await getHomeHotAPI()
  HotList.value = res.result
}

const { guessRef, onScrollTolower } = useGuessList()

// const guessRef = ref<XtxGuessInstance>()
// const onScrollTolower = () => {
//   guessRef.value?.getHomeGoods()
// }

const isTriggered = ref(false)
const onRefresherRefresh = async () => {
  isTriggered.value = true
  guessRef.value?.resetData()
  await Promise.all([getHomeBanner(), getHomeCategory(), getHomeHot()])
  guessRef.value?.getHomeGoods()
  isTriggered.value = false
}

const isLoading = ref(false)
onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBanner(), getHomeCategory(), getHomeHot()])
  isLoading.value = false
})
</script>

<template>
  <CustomNavbar />
  <scroll-view
    @scrolltolower="onScrollTolower"
    @refresherrefresh="onRefresherRefresh"
    :refresher-triggered="isTriggered"
    scroll-y
    class="scroll-view"
    refresher-enabled
  >
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <XtxSwiper :list="bannerList" />
      <CategoryPanel :list="CategoryList" />
      <HotPanel :list="HotList" />
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
//
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
