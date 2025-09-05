namespace $.$$ {
	export class $tukanable_gymload_builder_day_results extends $.$tukanable_gymload_builder_day_results {
		@$mol_mem
		override rows() {
			return this.data_ids().map( id => this.Row( id ) )
		}

		override row_idx( id: any ): number {
			return id - 1
		}

		@$mol_mem
		override set_rows( id: any ) {
			return Array.from( { length: this.row_sets( id ) } ).map( ( _, idx ) => this.SetResult( `${ id }_${ idx }` ) )
		}

		override set_idx( id: any ) {
			return id.split( '_' )[ 1 ] || 0
		}

		override excercise_idx( id: any ): number {
			return Number( id.split( '_' )[ 0 ] )
		}

		override excercise_plan( id: any ): readonly ( number )[] {
			return this.plan( this.excercise_idx( id ) )
		}

		@$mol_mem
		override week_items() {
			const items: $mol_view[] = []
			const week_count = this.week_count()

			for (let i = 0; i < week_count; i++)
				items.push(this.WeekTab(i))

			items.push(this.EditTab())

			return items
		}

		override week_tab_title_short( id: any ): string {
			return ( id + 1 ).toString()
		}

		override week_tab_title( id: any ): string {
			return super.week_tab_title( id ) + ( id + 1 ).toString()
		}

		override current_week_number(): number {
			return Number( this.current_week() )
		}

		override day_title(): string {
			return super.day_title() + ( this.day_index() + 1 ).toString()
		}

		override set_reps( id: any ): number {
			return this.row_reps( this.excercise_idx( id ) )
		}

		@$mol_mem
		next_unworked_week() {
			const ids = this.data_ids()
			const week_count = this.week_count()

			for ( let w = 0; w < week_count; w++ ) {
				const touched = ids.some( id =>
					this.set_rows(id).some( r => 
						r.original_week_weight( w ) !== null
					)
				)

				if ( !touched ) return w
			}

			return 0
		}

		@$mol_mem
		override current_week( next?: string ): string {
			const key = `${ this }.current_week()`
			return $mol_state_session.value( `${ this }.current_week()` , next ) ||
			    // set to next unworked week by default
				$mol_state_session.value( `${ this }.current_week()`, this.next_unworked_week().toString() )
		}
	}
}
