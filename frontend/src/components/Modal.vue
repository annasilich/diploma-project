<template>
	<div v-show="show" class="form">
		<form class="new-template-form-container" action="#">
			<button
				@click="close"
				type="button"
				class="btn-close close"
				aria-label="Close"
			></button>
			<slot />
		</form>
	</div>
</template>

<script>
export default {
	name: 'Modal',
	data() {
		return {
			show: false,
		}
	},
	methods: {
		open() {
			this.show = true
		},
		close() {
			this.show = false
		},
	},
}
</script>

<style lang="less">
.form {
	display: flex;
	height: 100vh;
	width: 100vw;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(61, 61, 61, 0.7);

	/* visibility: hidden; */
}

.new-template-form-container {
	position: relative;
	margin: auto;
}
.close {
	position: absolute;
	top: 5%;
	left: 90%;
}
</style>
