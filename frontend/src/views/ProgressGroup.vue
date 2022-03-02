<template>
	<div>
		<router-link class="btn card btn-back" tag="div" to="/courses">
			<img src="../assets/arrow-left.svg">
			<div class="back">Назад</div>
		</router-link>
		<div class="card groups">
			<h3>Активность {{ group_name }} по курсу «{{ course_name }}»</h3>
			<ProgressTable :course="course" :group="group" />
		</div>
	</div>
</template>

<script>
import Request from '../services/request'
import ProgressTable from '../components/ProgressTable.vue'
export default {
	props: {
		course: {
			type: String,
			required: true,
		},
		group: {
			type: String,
			required: true,
		},
	},
	components: {
		ProgressTable,
	},
	data() {
		return {
			course_name: '',
			group_name: '',
		}
	},
	methods: {
	async setValues() {
		
		const course = await Request.getCourseNameById(parseInt(this.course))
		const group = await Request.getGroupNameById(parseInt(this.group))

		this.course_name = course[0].name
		this.group_name = group[0].name
		}
	},
	beforeMount() {
		this.setValues()
	}
}
</script>

<style lang="less">
.groups {
	//margin: 100px 30px 0 30px;
	//padding: 15px;
	border: none;
}

.btn-back {
	display: block;
	width: 90px;
	margin-left: 5%;
	padding-left: 10px;
	padding-right: 10px;
}

.back {
	display: inline-block;
	margin-left: 5px;
}
</style>
