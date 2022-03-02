export default {
	methods: {
		timeContainers(times) {
			let containers = times.map(
				(time) => new Date(time).getTime() - (new Date(time).getTime() % 180000)
			)

			// remove duplicate
			containers = [...new Set(containers)]

			containers.sort((a, b) => {
				if (a > b) return 1
				if (a < b) return -1
				return 0
			})

			return containers
		}
	}
}