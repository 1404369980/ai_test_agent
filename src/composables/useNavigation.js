/**
 * 导航相关的 composable
 */
import { useRouter } from 'vue-router'

/**
 * 返回首页的 composable
 */
export function useNavigation() {
  const router = useRouter()

  const goHome = () => {
    router.push('/')
  }

  return {
    goHome
  }
}

