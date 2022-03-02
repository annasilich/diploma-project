import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import CoursesList from '../views/CoursesList.vue'
import ProgressGroup from '../views/ProgressGroup.vue'
import PracticalWork from '../views/PracticalWork.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/courses',
		name: 'CoursesList',
		component: CoursesList,
	},
	{
		path: '/progress/:course/:group',
		name: 'ProgressGroup',
		component: ProgressGroup,
		props: true,
	},
	{
		path: '/work/:work_id',
		name: 'PracticalWork',
		component: PracticalWork,
		props: true,
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
