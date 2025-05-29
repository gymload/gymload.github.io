namespace $.$$ {
	export class $gymload_builder extends $.$gymload_builder {
		override week_items() {
			return Array.from({ length: this.day_count() }, (_, i) => this.Day(i))
		}

		override day_title( id: any ) {
			return `Day ${id + 1}`
		}

		override day_id ( id: any ) {
			return id
		}
	}
}