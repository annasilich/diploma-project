<template>
	<div>
		<h3>Созданные шаблоны</h3>
		<div class="templtes-cards">
			<div
				class="card"
				style="width: 15rem"
				v-for="template in templates"
				:key="template.id"
			>
				<input
					class="form-check-input mt-0 card-check"
					type="checkbox"
					v-model="template.selected"
				/>
				<img
					@click="openEditTemplate(template)"
					src="../assets/pencil.svg"
					class="edit-icon"
					alt="edit"
				/>
				<img
					@click="openEditTemplate(template)"
					src="../assets/googledoc_icon.svg"
					class="card-img-top googledoc-icon"
					alt="googledoc icon"
				/>
				<div class="card-body">
					<h5 class="card-title bold">{{ template.name }}</h5>
					<p class="card-text">{{ template.description }}</p>
					<button @click="openCreateDocuments(template)" class="btn btn-primary">
						Создать работы по шаблону
					</button>
				</div>
			</div>
		</div>
		<Modal ref="create_documents">
			<CreateDocuments @close="closeCreateDocuments" ref="create_documents_form"/>
		</Modal>
		<Modal ref="edit_template">
			<EditTemplate @close="closeEditTemplate" ref="edit_template_form"/>
		</Modal>
	</div>
</template>

<script>
import Request from '../services/request'
import Modal from './Modal.vue'
import CreateDocuments from './CreateDocuments.vue'
import EditTemplate from './EditTemplate.vue'
export default {
	components: {
		Modal,
		CreateDocuments,
		EditTemplate,
	},
	data() {
		return {
			templates: [],
		}
	},
	methods: {
		openCreateDocuments(template) {
			this.$refs.create_documents.open()
			this.$refs.create_documents_form.setParams(template.id)
		},
		openEditTemplate(template) {
			this.$refs.edit_template.open()
			this.$refs.edit_template_form.setParams(template.id, template.name, template.description, template.link)
		},
		closeCreateDocuments() {
			this.$refs.create_documents.close()
		},
		closeEditTemplate() {
			this.$refs.edit_template.close()
			this.getTemplates()
		},
		async getTemplates() {
			this.templates = await Request.getTemplates()
		},
		async deleteTemplate() {
			let tmp = false
			for (let template of this.templates) {
			 	if (template.selected) {
					let cnf = confirm("Подтвердите удаление шаблона");
					if (cnf) await Request.deleteTemplate(template.id)
					tmp = true
				}
			}
			if (!tmp) alert("Выберите хотя бы один шаблон, который хотите удалить");
			this.getTemplates()
		},
	},
	beforeMount() {
		this.getTemplates()
	},
}
</script>

<style lang="less" scoped>
.templtes-cards {
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
.googledoc-icon {
	margin-top: 30px;
	margin-left: auto;
	margin-right: auto;
	width: 100px;
	cursor: pointer;
}

.card-title {
	font-size: 1.125em;
}

.edit-icon {
	display: inline-block;
	position: absolute;
	top: 6%;
	left: 82.5%;
	width: 1.5em;
	height: 1.45em;
	cursor: pointer;
}
.edit-icon:hover {
	opacity: 0.5;
}

.card-check {
	display: inline-block;
	position: absolute;
	top: 6%;
	left: 7.5%;
	border-radius: 50%;
	width: 1.5em;
	height: 1.5em;
	cursor: pointer;
}


.bold {
	font-weight: bold;
}
</style>
