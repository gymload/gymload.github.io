namespace $.$$ {
	export class $tukanable_gymload_builder_day_results extends $.$tukanable_gymload_builder_day_results {
		override rows() {
			return this.data_ids().map( id => this.Row( id ) )
		}

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

		override week_items() {
			return Array.from( { length: this.week_count() }, ( _, i ) => this.WeekTab( i ) )
		}

		override week_tab_title( id: any ): string {
			return `Week ${ id + 1 }`
		}

		override current_week_number(): number {
			return Number( this.current_week() )
		}

		override day_title(): string {
			return `Day №${ this.day_index() + 1 }`
		}

		override row_exercise_extra( id: any ): string {
			const title = this.row_exercise( id )
			const sets = this.row_sets( id )
			const reps = this.row_reps( id )

			return `${ title } ${ sets }x${ reps }`
		}
	}
}