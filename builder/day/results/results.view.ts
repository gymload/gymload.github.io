namespace $.$$ {
	export class $gymload_builder_day_results extends $.$gymload_builder_day_results {
		override rows() {
			return this.data_ids().map( id => this.Row( id ) )
		}

		override set_rows( id: any ) {
			return Array.from( { length: this.row_sets( id ) } ).map( ( _, idx ) => this.SetResult( idx ) )
		}

		override set_idx( id: any ) {
			return id
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
	}
}