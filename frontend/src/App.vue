<template>
	<div id="app">
		<Navbar />
		<router-view />
	</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
	components: {
		Navbar,
	},
	methods: {
		openNewTemplateForm() {
			this.$refs.new_template.open()
		},
		deleteTemplate() {
			this.$refs.templates.deleteTemplate()
		},
	},
}
</script>

<style lang="less">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
	border-radius: 5px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
	border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>
