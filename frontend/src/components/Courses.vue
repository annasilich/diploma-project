<template>
	<div class="card subjects">
		<h3>Активность по курсам</h3>
		<div class="subjects-cards">
			<div
				class="card"
				style="width: 15rem"
				v-for="course in courses"
				:key="course.id"
			>
				<img
					src="../assets/subject_icon.png"
					class="card-img-top subject-icon"
					alt="subject icon"
				/>
				<div class="card-body">
					<h5 class="card-title bold">{{ course.name }}</h5>
					<router-link
						type="button"
						class="btn btn-link"
						v-for="group of course.groups"
						:key="group.id"
						:to="`/progress/${course.id}/${group.id}`"
					>
						{{ group.name }}
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>
 
<script>
import Request from '../services/request'
export default {
	data() {
		return {
			courses: [],
		}
	},
	methods: {
		async setValues() {
			const courses = await Request.getCoursesForTeacher()

			for (let i = 0; i < courses.length; i++) {
				courses[i].groups = await Request.getGroupsForCourse(courses[i].id)
			}

			this.courses = courses
		},
	},
	beforeMount() {
		this.setValues()
	},
}
</script>

<style lang="less">
.subjects {
	margin: 100px 30px 0 30px;
	padding: 15px;
	border: none;
}

.subjects-cards {
	width: 100%;
	margin: auto;
}

.card {
	display: inline-block;
	vertical-align: top;
	position: relative;
	margin: 15px;
	padding: 5px;
}

.card-title {
	font-size: 1.125em;
}

.subject-icon {
	margin-top: 30px;
	margin-left: auto;
	margin-right: auto;
	width: 100px;
}

.bold {
	font-weight: bold;
}
</style>
