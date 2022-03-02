<template>
	<div>
		<nav
			class="navbar navbar-expand-lg navbar-light"
			style="background-color: #e3f2fd"
		>
			<div class="container-fluid">
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
					aria-controls="navbarNav"
					aria-expanded="false"
					aria-label="Toggle navigation"
					@click="toggleDropdown"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div
					class="navbar-collapse"
					:class="{ collapse: !dropdown }"
					id="navbarNav"
				>
					<ul class="navbar-nav">
						<li class="nav-item">
							<router-link
								class="nav-link bold"
								exact-active-class="active"
								aria-current="page"
								to="/"
								>Шаблоны</router-link
							>
						</li>
						<li class="nav-item">
							<router-link
								class="nav-link bold"
								exact-active-class="active"
								to="/courses"
								>Активность по курсам</router-link
							>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	</div>
</template>
<script>
export default {
	data() {
		return {
			dropdown: false,
		}
	},
	methods: {
		toggleDropdown() {
			this.dropdown = !this.dropdown
		},
	},
}
</script>
<style lang="less" scoped>
.bold {
	font-weight: bold;
}
</style>
