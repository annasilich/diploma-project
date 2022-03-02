<template>
	<div>
		<div class="card templates">
			<Templates ref="templates" />
			<div>
				<button
					@click="openNewTemplateForm"
					type="button"
					class="btn btn-success new-template btn-display"
				>
					Создать новый шаблон
				</button>
				<button
					@click="deleteTemplate"
					type="button"
					class="btn btn-danger btn-display"
				>
					Удалить шаблон
				</button>
			</div>
		</div>
		<Modal ref="new_template">
			<CreateTemplate @close="closeNewTemplateForm" />
		</Modal>
	</div>
</template>

<script>
import Templates from '../components/Templates.vue'
import Modal from '../components/Modal.vue'
import CreateTemplate from '../components/CreateTemplate.vue'
export default {
	components: {
		Modal,
		CreateTemplate,
		Templates,
	},
	methods: {
		openNewTemplateForm() {
			this.$refs.new_template.open()
		},
		closeNewTemplateForm() {
			this.$refs.new_template.close()
			this.$refs.templates.getTemplates()
		},
		deleteTemplate() {
			this.$refs.templates.deleteTemplate()
		},
	},
}
</script>

<style lang="less">
.templates {
	margin: 100px 30px 0 30px;
	padding: 15px;
	border: none;
}

.btn.new-template {
	margin: 15px auto;
	max-width: 300px;
}

.btn-display {
	display: inline-block;
	margin-left: 15px;
	margin-right: 15px;
}
</style>
