// 猜你喜欢上拉加载更多
import type { XtxGuessInstance } from '@/types/components'
import { ref } from 'vue'

export const useGuessList = () => {
  const guessRef = ref<XtxGuessInstance>()
  const onScrollTolower = () => {
    guessRef.value?.getHomeGoods()
  }

  return {
    guessRef,
    onScrollTolower,
  }
}
