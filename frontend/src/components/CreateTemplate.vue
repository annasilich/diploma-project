<template>
	<div class="create-template">
		<h4 class="title-margin">Создать новый шаблон</h4>
		<div class="mb-3">
			<p class="description txt-align">
				Создайте новый шаблон для практических заданий с помощью вашего
				Google-аккаунта, выделив желтым фоном текст, который должен быть изменен
				студентом
			</p>
			<a
				href="https://docs.google.com/document/create"
				target="_blank"
				class="btn btn-primary new-margin"
				>Редактор шаблона</a
			>
			<div>
				<a
					href="https://drive.google.com/file/d/1n56O1ivlBibwVB9VqV-na2-EF1rvoLdB/view?usp=sharing"
					target="_blank"
					class="btn btn-link"
					>Пример шаблона</a
				>
			</div>
		</div>
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
			<p class="prompt txt-align">
				После того, как вы отредактировали шаблон, откройте доступ к документу
				по ссылке:
			</p>
			<div class="form-text">
				Файл -> Открыть доступ -> Разрешить доступ всем, у кого есть ссылка ->
				Копировать ссылку -> Нажать Готово
			</div>
			<label class="form-label new-margin">Ссылка на документ</label>
			<input
				type="text"
				required
				class="form-control input-text"
				v-model="link"
			/>
		</div>
		<button @click="createNewTemplate" class="btn btn-success">
			{{ btnText }}
		</button>
	</div>
</template>


<script>
import Request from '../services/request'
export default {
	name: 'CreateTemplate',
	data() {
		return {
			name: '',
			description: '',
			link: '',
		}
	},
	computed: {
		btnText() {
			if (this.loading) {
				return 'Создание...'
			}

			return 'Создать шаблон'
		}
	},
	methods: {
		close() {
			this.$emit('close')
		},
		async createNewTemplate() {
			if (this.name == '' || this.link == '') alert("Заполните обязательные поля: название шаблона и ссылку на документ")
			else {
				let cnf = confirm("Подтвердите создание шаблона");
				if (cnf) {
					this.loading = true
					const document_id = this.link.replace('https://docs.google.com/document/d/', '').replace('https://drive.google.com/file/d/', '').split('/')[0]
					console.log(document_id, this.link)
					let res = await Request.createTemplate(this.name, this.description, document_id, this.link)
					if (res.status == 500) 
						alert("Ошибка. Проверьте корректность указанной ссылки и разрешен ли доступ по ссылке к вашему документу")
					else {
						this.name = '' 
						this.description = ''
						this.link = ''
						this.close()
					}
					this.loading = false
				}
			}
		}
	},
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
