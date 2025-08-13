namespace $.$$ {
	export class $tukanable_gymload_builder extends $.$tukanable_gymload_builder {
		override week_items() {
			return Array.from( { length: this.day_count() }, ( _, i ) => this.DaySettings( i ) )
		}

		override day_title( id: any ) {
			return super.day_title( id ) + ( id + 1 ).toString()
		}

		override day_index( id: any ) {
			return id
		}

		override top_desk_items(): readonly ( $mol_view )[] {
			return [
				...Array.from( { length: this.day_count() }, ( _, i ) => this.DayResults( i ) ),
				this.Settings(),
				this.Stats(),
				this.Print(),
			]
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
			return this.$.$mol_state_local.value( key, next ) || 3
		}

		override show_charts( next?: boolean ): boolean {
			return this.$.$mol_state_local.value( this.build_key( 'show_charts' ), next ) ?? super.show_charts()
		}

		override top_desk_current( next?: string ) {
			return this.$.$mol_state_session.value( `${ this }.top_desk_current()` , next ) || super.top_desk_current()
		}

		override progress_formula( next?: string ): string {
			return this.$.$mol_state_local.value( this.build_key( 'progress_formula' ), next ) || super.progress_formula()
		}

		override start_percent( next?: number ): number {
			return this.$.$mol_state_local.value( this.build_key( 'start_percent' ), next ) || super.start_percent()
		}
	}
}
