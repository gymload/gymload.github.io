namespace $.$$ {
	export class $tukanable_gymload_builder extends $.$tukanable_gymload_builder {
		override minimal_width(): number {
			return Math.min(800, $mol_view_visible_width())
		}

		override maximal_width(): number {
			return 800
		}

		override body() {
			const items: $mol_view[] = []

			if (this.day_count() === 0) {
				items.push(this.HelloHint())
			}

			items.push(this.Settings())

			return items
		}

		override week_items() {
			return Array.from( { length: this.day_count() }, ( _, i ) => this.DaySettings( i ) )
		}

		override day_title( id: any ) {
			return super.day_title( id ) + ( id + 1 ).toString()
		}

		override day_index( id: any ) {
			return id
		}

		build_key( s: string ): string {
			return `${ this.storage_key() }_v1_${ s }`
		}

		override day_storage_key( id: any ): string {
			return `${ this.storage_key() }_v1_day_${ id }`
		}

		override week_count( next?: number ): number {
			const key = this.build_key( 'week_count' )
			return this.$.$mol_state_local.value( key, next ) || 10
		}

		override day_count( next?: number ): number {
			const key = this.build_key( 'day_count' )
			return this.$.$mol_state_local.value( key, next ) || 0
		}

		override show_charts( next?: boolean ): boolean {
			return this.$.$mol_state_local.value( this.build_key( 'show_charts' ), next ) ?? super.show_charts()
		}

		override progress_formula( next?: string ): string {
			return this.$.$mol_state_local.value( this.build_key( 'progress_formula' ), next ) || super.progress_formula()
		}

		override start_percent( next?: number ): number {
			return this.$.$mol_state_local.value( this.build_key( 'start_percent' ), next ) || super.start_percent()
		}

		override current_week_item(next?: string): string {
			return this.$.$mol_state_arg.value( 'wi', next ) || '0'
		}
	}
}
