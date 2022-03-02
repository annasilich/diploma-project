<template>
	<div>
		<table class="table">
			<thead>
				<tr>
					<th scope="col">№</th>
					<th scope="col">ФИО студента</th>
					<th scope="col">Практические работы</th>
					<th scope="col">Активность в семестре</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(student, i) in students" :key="student.id" 
				:class= "{ 'tr-red': studentResult(student) == -1, 
				'tr-yellow': studentResult(student) == 1}">
					<th>{{ i + 1 }}</th>
					<td>{{ student.full_name }}</td>
					<td>
						<router-link
							type="button"
							class="btn work-align"
							v-for="(work, i) in student.works"
							:key="i"
							:to="`/work/${work.id}`"
							:class= "{ 'btn-secondary': !work.complited, 
							'btn btn-warning': (work.complited && !isDeadline(work)),
							'btn-success': (work.complited && isDeadline(work)) }"
						>
							{{ toShortName(work.work_name) }}
						</router-link>
					</td>
					<td>{{ student.progress }} мин.</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import Request from '../services/request'
import timeContainers from '../mixins/timeContainers'

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
	mixins: [timeContainers],
	data() {
		return {
			students: [],
		}
	},
	methods: {
		async setStudents() {
			const students = await Request.getStudentsByGroupId(parseInt(this.group))
			
			for (let i = 0; i < students.length; i++) {
				students[i].works = await Request.getWorksForStudent(parseInt(this.course), students[i].id)
				students[i].works = await Promise.all(
					students[i].works.map(work => Request.getWorkInfo(work.id))
				)
				students[i].works = students[i].works.map(work => work[0])
				students[i].progress = students[i].works
					.map(work => this.timeContainers(work.times))
					.reduce((a, b) => a + ((b.length - 1) * 3), 0)
			}
			
			this.students = students
		},
		toShortName(name) {
			let name_array = name.split(' ')
			const short_name = []
			for (let i = 0; i < name_array.length; i++) {
				short_name.push(name_array[i][0])
			}
			return short_name.join('').toUpperCase()
		},
		isDeadline(work) {
			if (work.finished_at > work.deadline) {
				return false
			}
			else return true
		},
		studentResult(student) {
			let works = student.works
			let count = 0
			if (works.length > 0) {
				for (let i = 0; i < works.length; i++) {
					if ((works[i].complited == false) && (works.length > 1)) return -1
					else if ((works[i].complited) && (works[i].finished_at > works[i].deadline)) {
						count++
					}
				}
				console.log(works.length)
				if ((works.length > 1) && (count >= Math.floor(works.length / 2))) return 1
			}
		},
	},
	beforeMount() {
		this.setStudents()
	},
}
</script>

<style lang="less">
.work-align {
	padding-top: 2.5px;
	padding-bottom: 2.5px;
	padding-left: 7.5px;
	padding-right: 7.5px;
	margin-left: 5px;
	margin-right: 5px;
	font-size: 12px;
}

.tr-red {
	background-color: red;
}

.tr-yellow {
	background-color: yellow;
}
</style>
