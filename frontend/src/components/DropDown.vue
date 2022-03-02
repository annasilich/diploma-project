<template>
	<div class="dropdown left-margin">
		<button
			class="btn dropdown-toggle"
			type="button"
			data-bs-toggle="dropdown"
			aria-expanded="false"
			@click="toggle"
		>
		{{ title }}
		</button>
		<ul
			class="dropdown-menu"
			:class="{ show: dropdown }"
			aria-labelledby="dropdownMenuButton"
		>
			<li v-for="(label, i) in labels" :key="i" class="dropdown-item itm" 
			@click="selectItem(label.id); title = label.name; toggle()">
				{{ label.name }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		labels: {
			type: Array,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			dropdown: false,
			titile: '',
		}
	},
	methods: {
		toggle() {
			this.dropdown = !this.dropdown
		},
		setTitle() {
			this.title = this.type
		},
		selectItem(id) {
			if (this.type == 'Дисциплина') this.$emit('select_course_id', id)
			if (this.type == 'Группа') this.$emit('select_group_id', id)
		}
	},
	beforeMount() {
		this.setTitle()
	},
}
</script>

<style scoped>
	.itm {
		cursor: pointer;
	}
</style>
