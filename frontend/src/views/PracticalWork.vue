<template>
	<div>
		<router-link
			class="btn card btn-back"
			tag="div"
			:to="`/progress/${work_info.course_id}/${work_info.group_id}`"
		>
			<img src="../assets/arrow-left.svg" />
			<div class="back">Назад</div>
		</router-link>
		<h3>Статистика по работе</h3>
		<div class="container">
			<div class="row">
				<div class="col-md-5">
					<div class="card card-align mb-3 txt-align w-100 intervals-card">
						<h5>Время выполнения</h5>
						<label class="form-label txt">{{ sum_time }} мин.</label>
						<h5>Интервалы выполнения</h5>
						<div class="dates-start">Начало: {{ min_date.toLocaleString() }}</div>
						<div class="intervals-wrap">
							<!-- <div class="dates-start">Начало: {{ min_date.toLocaleString() }}</div> -->
							<div class="progress-vertical bg-light">
								<div
									v-for="(interval, i) in intervals"
									:key="`interval-${i}`"
									class="progress-vertical-bar tt tt-right tt-small"
									:class="{
										'bg-light': !interval.active,
										'bg-warning': interval.active,
									}"
									:style="{ height: `${interval.size * 10}px` }"
								>
									<span class="tt-text" v-if="interval.active"
										>{{ interval.from.toLocaleString() }} -
										{{ interval.to.toLocaleString() }}</span
									>
								</div>
							</div>
							<div class="dates-end">Конец: {{ end.toLocaleString() }}</div>
						</div>
					</div>
				</div>
				<div class="col-md-7">
					<div class="card card-align mb-3 txt-align w-100">
						<h5>Информация о работе</h5>
						<label class="form-label txt"
							>{{ work_info.work_name }} <br />
							студента {{ work_info.student_sname }} {{ work_info.group_name }}
							<br />
							по курсу «{{ work_info.course_name }}»
						</label>
						<label class="form-label txt">Дедлайн по работе: {{ new Date(work_info.deadline).toLocaleString() }}</label>
					</div>
					<div class="card card-align mb-3 w-100">
						<div class="status">
							<div class="status-left">
								<h5>Статус работы</h5>
								<label class="form-label txt">{{ status }}</label>
							</div>
							<button class="btn btn-success" v-if="!this.work_info.complited"
								@click="changeStatus"
							>Оценить</button>
						</div>
					</div>
					<div class="card card-align mb-3 txt-align w-100">
						<h5>Ссылка на работу</h5>
						<input name="textfield" type="text" size="40" :value="link" />
						<button class="btn tt btn-secondary mrgn" @click="copyLink">
							Копировать ссылку
							<span class="tt-text active" v-if="copied">Ссылка скопирована</span>
						</button>
						<a :href="link" target="_blank" class="btn btn-success mrgn"
							>Открыть</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Request from '../services/request'

import timeContainers from '../mixins/timeContainers'
export default {
	props: {
		work_id: {
			type: String,
			required: true,
		},
	},
	mixins: [timeContainers],
	data() {
		return {
			work_info: [],
			sum_time: 0,
			min_date: new Date(),
			max_date: new Date(),
			intervals: [],
			intervalsSize: 0,
			copied: false,
		}
	},
	computed: {
		status() {
			if (this.work_info.complited) {
				return 'Работа завершена'
			}

			return 'В процессе выполнения'
		},
		link() {
			return (
				'https://drive.google.com/file/d/' +
				this.work_info.document_id +
				'/edit?usp=sharing'
			)
		},
		end() {
			if (!this.work_info.complited) return this.max_date
			else return this.work_info.finished_at
		}
	},
	methods: {
		async setValues() {
			const work_info = await Request.getWorkInfo(parseInt(this.work_id))

			this.work_info = work_info[0]

			this.formatIntervals(this.work_info.times)
		},
		formatIntervals(times) {
			const containers = this.timeContainers(times)

			const now = Date.now()
			const maxDate = now + (180000 - (now % 180000))
			const minDate = containers[0]
			const maxValue = (maxDate - minDate) / 180000
			const intervals = []
			let previousActiveCount = 0
			let previousUnactiveCount = 0

			for (let i = 1; i < maxValue; i++) {
				const current = minDate + i * 180000

				if (containers.includes(current)) {
					if (previousUnactiveCount) {
						intervals.push({
							active: false,
							size: previousUnactiveCount,
							from: new Date(current - previousUnactiveCount * 180000),
							to: new Date(current),
						})
						previousUnactiveCount = 0
					}
					previousActiveCount++
				} else {
					if (previousActiveCount) {
						intervals.push({
							active: true,
							size: previousActiveCount,
							from: new Date(current - previousActiveCount * 180000),
							to: new Date(current),
						})
						previousActiveCount = 0
					}
					previousUnactiveCount++
				}
			}

			if (previousActiveCount) {
				intervals.push({
					active: true,
					size: previousActiveCount,
					from: new Date(maxDate - previousActiveCount * 180000),
					to: new Date(maxDate),
				})
				previousActiveCount = 0
			} else if (previousUnactiveCount) {
				intervals.push({
					active: false,
					size: previousUnactiveCount,
					from: new Date(maxDate - previousUnactiveCount * 180000),
					to: new Date(maxDate),
				})
				previousUnactiveCount = 0
			}

			this.min_date = new Date(minDate)
			this.max_date = new Date(maxDate)
			this.intervals = intervals
			this.intervalsSize = maxValue - 1
			this.sum_time = (containers.length - 1) * 3

			console.log(intervals)
		},
		copyLink() {
			this.$clipboard(this.link)
			this.copied = true
			setTimeout( () => {
				this.copied = false
			}, 1000);
		},
		async changeStatus() {
			let cnf = confirm("Подтвердите завершение работы");
			if (cnf) {
				let res = await Request.changeStatus(this.work_id) 
				if (res.status == 500) 
					alert("Ошибка")
				else {
					alert("Статус работы успешно обновлен")
				}
			}
		},
	},
	beforeMount() {
		this.setValues()
	},
}
</script>
<style lang="less" scoped>
.work {
	margin: 100px 30px 0 30px;
	padding: 15px;
	border: none;
}

.card-align {
	min-width: 65%;
	padding: 15px;
	margin: 5px;
}

.card-dop {
	margin: 0;
	padding: 5px;
}

.mrgn {
	margin: 10px;
	line-height: 1.2;
}

.btn-aligh {
	margin: 0 auto;
	display: block;
}

.schedule {
	width: 200px;
}

.status {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.status-left {
	text-align: left;
}

.dates {
	display: flex;
	justify-content: space-between;
}

.intervals-card {
	display: flex;
	height: 600px;
}

.intervals-wrap {
	overflow-y: scroll;
	overflow-x: hidden;
	flex: 1;
}

.progress-vertical {
	height: fit-content;
	width: 16px;
	display: flex;
	flex-direction: column;
	margin: 10px 0;
}

.progress-vertical-bar {
	width: 100%;
}

.progress-vertical-bar.bg-warning:hover {
	background: #dc3545 !important;
	cursor: pointer;
}

.progress-vertical-bar:first-of-type {
	border-radius: 0.25rem 0.25rem 0 0;
}

.progress-vertical-bar:last-of-type {
	border-radius: 0 0 0.25rem 0.25rem;
}

.tt {
	position: relative;
}

.tt .tt-text {
	visibility: hidden;
	width: 120px;
	background-color: black;
	color: #fff;
	text-align: center;
	padding: 5px 0;
	border-radius: 6px;

	position: absolute;
	z-index: 1;
	width: fit-content;
	bottom: calc(100% + 10px);
	left: 50%;
	transform: translate(-50%, 0);
	padding: 5px 10px;
}

.tt.tt-right .tt-text {
	transform: translate(0, 50%);
	bottom: 50%;
	left: calc(100% + 10px);
	width: 160px;
}

.tt.tt-small .tt-text {
	font-size: 12px;
}

.tt:hover .tt-text, 
.tt-text.active {
	visibility: visible;
}

.columns-container {
	display: flex;
	flex-direction: row-reverse;
	margin: 25px;
}

.columns {
	display: flex;
	flex-direction: column;
	margin: 25px;
	width: 50%;
	height: 100%;
}
</style>
