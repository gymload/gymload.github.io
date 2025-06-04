namespace $.$$ {
	export class $gymload_builder extends $.$gymload_builder {
		override week_items() {
			return Array.from({ length: this.day_count() }, (_, i) => this.DaySettings(i))
		}

		override day_title( id: any ) {
			return `Day ${id + 1}`
		}

		override day_index ( id: any ) {
			return id
		}

		override top_desk_items(): readonly ( $mol_view )[] {
			return [
				this.Settings(),
				...Array.from({ length: this.day_count() }, (_, i) => this.DayResults(i))
			]
		}

		build_key(s: string): string {
			return `${this.storage_key()}_v1_${s}`
		}

		override day_storage_key( id: any ): string {
			return `${this.storage_key()}_v1_day_${id}`
		}

		override week_count( next?: number ): number {
			const key = this.build_key('week_count')
			return this.$.$mol_state_local.value(key, next) || 10
		}

		override day_count( next?: number ): number {
			const key = this.build_key('day_count')
			return this.$.$mol_state_local.value(key, next) || 3
		}
	}
}