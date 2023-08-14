import { http } from '@/utils/http'
import type { bannerItem, CategoryItem, HotItem } from '@/types/home'
import type { PageResult, PageParams, GoodsItem } from '@/types/global'

export const getHomeBannerAPI = (distributionSite = 1) => {
  return http<bannerItem[]>({
    url: '/home/banner',
    method: 'GET',
    data: {
      distributionSite,
    },
  })
}

export const getHomeCategoryAPI = () => {
  return http<CategoryItem[]>({
    url: '/home/category/mutli',
    method: 'GET',
  })
}

export const getHomeHotAPI = () => {
  return http<HotItem[]>({
    url: '/home/hot/mutli',
    method: 'GET',
  })
}

export const getHomeGoodsAPI = (data?: PageParams) => {
  return http<PageResult<GoodsItem>>({
    url: '/home/goods/guessLike',
    method: 'GET',
    data,
  })
}
