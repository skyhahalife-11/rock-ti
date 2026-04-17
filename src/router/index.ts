import { createRouter, createWebHistory } from 'vue-router'
import HomePage    from '../pages/HomePage.vue'
import IntroPage   from '../pages/IntroPage.vue'
import QuizPage    from '../pages/QuizPage.vue'
import LoadingPage from '../pages/LoadingPage.vue'
import ResultPage  from '../pages/ResultPage.vue'

const router = createRouter({
  history: createWebHistory('/rock/'),
  routes: [
    { path: '/',        name: 'home',    component: HomePage    },
    { path: '/intro',   name: 'intro',   component: IntroPage   },
    { path: '/quiz',    name: 'quiz',    component: QuizPage    },
    { path: '/loading', name: 'loading', component: LoadingPage },
    { path: '/result',  name: 'result',  component: ResultPage  },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
