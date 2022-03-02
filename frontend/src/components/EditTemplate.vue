<template>
	<div class="create-template">
		<h4 class="title-margin">Редактировать шаблон</h4>
		<div class="mb-3 txt-align">
			<label class="form-label">Название шаблона</label>
			<input
				type="text"
				required
				class="form-control input-text"
				v-model="name"
			/>
		</div>
		<div class="mb-3 txt-align">
			<label class="form-label">Краткое описание шаблона</label>
			<textarea
				class="form-control input-text"
				rows="2"
				v-model="description"
			></textarea>
		</div>
		<div class="mb-3 txt-align">
			<label class="form-label new-margin">Ссылка на документ</label>
			<input
				type="text"
				required
				class="form-control input-text"
				v-model="link"
			/>
		</div>
		<div>
			<button @click="editTemplate" class="btn btn-success">{{ btnText }}</button>
			<button @click="deleteTemplate" type="button" class="btn btn-danger btn-display">
				Удалить шаблон
			</button>
		</div>
	</div>
</template>

<script>
import Request from '../services/request'
export default {
	name: 'EditTemplate',
	data() {
		return {
			id: 0,
			name: '',
			description: '',
			link: '',
		}
	},
	computed: {
		btnText() {
			if (this.loading) {
				return 'Редатикрование...'
			}

			return 'Сохранить шаблон'
		}
	}, 
	methods: {
		setParams(id, name, description, link) {
			this.id = id
			this.name = name
			this.description = description
			this.link = link
		},
		close() {
			this.$emit('close')
		},
		async editTemplate() {
			if (this.name == '' || this.link == '') alert("Заполните обязательные поля: название шаблона и ссылку на документ")
			else { 
				let cnf = confirm("Подтвердите редактирование шаблона");
				if (cnf) {
					this.loading = true
					let res = await Request.editTemplate(this.id, this.name, this.description, this.link)
					if (res.status == 500) 
						alert("Ошибка. Проверьте корректность указанной ссылки и разрешен ли доступ по ссылке к вашему документу")
					else this.close()
					this.loading = false
				} 
			}
		},
		async deleteTemplate() {
			let cnf = confirm("Подтвердите удаление шаблона");
			if (cnf) {
				await await Request.deleteTemplate(this.id)
				this.close()
			}
		}
	}
}
</script>

<style lang="less">
.create-template {
	//display: inline-flex;
	//flex-direction: column;
	margin: auto;
	border-radius: 5%;
	background-color: #ffffff;
	padding: 30px;
	min-width: 450px;
}
.txt-align {
	text-align: left;
}

.title-margin {
	margin-top: 10px;
}
.new-margin {
	margin-top: 10px;
	//margin-left: 10px;
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
