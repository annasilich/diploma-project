<template>
	<div class="create-template">
		<h4 class="title-margin">Создать работы по шаблону</h4>
		<div class="txt-align">
			<label class="form-label"
				>Шаблон по дисциплине «Оценка качества ПО»</label
			>
		</div>
		<div class="txt-align">
			<DropDown
				:labels="courses"
				:type="type_course"
				@select_course_id="courseSelect"
			></DropDown>
		</div>
		<div class="txt-align">
			<DropDown
				:labels="groups"
				:type="type_group"
				@select_group_id="groupSelect"
			></DropDown>
		</div>
		<div class="mb-3 txt-align">
			<label class="form-label new-margin new-padd">Дедлайн по работе</label>
			<input type="date" id="start" v-model="work_deadline"
				max="2021-06-31" required>
		</div>
		<div class="mb-3 txt-align">
			<label class="form-label new-margin">Название работы</label>
			<input type="text" class="form-control input-text" v-model="work_name" required/>
		</div>
		<div class="form-text">Проверьте корректность введенных данных</div>
		<button class="btn btn-success new-margin" @click="createDocuments" :disabled="loading">
			{{ btnText }}
		</button>
	</div>
</template>

<script>

import Request from '../services/request'
import DropDown from './DropDown.vue'
export default {
	components: {
		DropDown,
	},
	data() {
		return {
			courses: [],
			groups: [],
			template_id: 0,
			type_course: 'Дисциплина',
			type_group: 'Группа',
			selected_course_id: 0,
			selected_group_id: 0,
			work_name: '',
			work_deadline: '',
			loading: false
		}
	},
	computed: {
		btnText() {
			if (this.loading) {
				return 'Создание...'
			}

			return 'Создать работы'
		}
	}, 
	methods: {
		close() {
			this.$emit('close')
			this.$router.push({ path: `/progress/${this.selected_course_id}/${this.selected_group_id}` })
		},
		setParams(id) {
			this.template_id = id
		},
		async setCourses() {
			this.courses = await Request.getCoursesForTeacher()
		},
		async setGroups() {
			this.groups = await Request.getGroupsForCourse(this.selected_course_id)
		},
		courseSelect(data) {
			this.selected_course_id = data
			this.setGroups()
		},
		groupSelect(data) {
			this.selected_group_id = data
		},
		async createDocuments() {
			if (this.selected_course_id === 0 || this.selected_group_id === 0)
				alert(`Выберите дисциплину и группу, для которых хотите создать документы`)
			else if (this.work_name == '') alert("Введите название работы")
			else if (this.work_deadline == '') alert("Задайте дедлайн для работы")
			else {
				let cnf = confirm("Подтвердите создание документов");
				if (cnf) {
					this.loading = true
					let res = await Request.createDocuments(
						this.work_name,
						this.work_deadline,
						this.template_id,
						this.selected_course_id,
						this.selected_group_id
					)
					if (res.status == 500) 
						alert("Ошибка при создании документов")
					else {
						this.close()
					}
					this.loading = false
				}
			}
		},
		toggleDropdown() {
			this.dropdown = !this.dropdown
		},
	},
	beforeMount() {
		this.setCourses()
	},
}
</script>

<style lang="less">
.create-template {
	margin: auto;
	border-radius: 5%;
	background-color: #ffffff;
	padding: 30px;
}
.txt-align {
	text-align: left;
}

.title-margin {
	margin-top: 10px;
}
.new-margin {
	margin-top: 10px;
}
.new-padd {
	padding-right: 10px;
}
.left-margin {
	margin-left: -12px;
}
.input-text {
	font-size: 14px;
	padding-left: 10px;
	color: grey;
}

.description {
	max-width: 420px;
	margin-top: 20px;
	margin-bottom: 0;
}

.prompt {
	max-width: 420px;
	margin-bottom: 0;
}

.form-control {
	padding-top: 5px;
	padding-bottom: 5px;
	padding-right: 0;
}

.form-text {
	max-width: 400px;
}
</style>
