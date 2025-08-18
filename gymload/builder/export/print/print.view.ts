namespace $.$$ {
	export class $tukanable_gymload_builder_export_print extends $.$tukanable_gymload_builder_export_print {
		override print_click() {
			print()
		}

		override day_idx( id: any ): number {
			return id
		}

		override body() {
			const items = [ ...super.body() ]

			for( let i = 0; i < this.day_count(); i++ ) {
				items.push( this.Day( i ) )
			}

			return items
		}
	}

	export class $tukanable_gymload_builder_export_print_day extends $.$tukanable_gymload_builder_export_print_day {
		override excercise_sets( id: any ): number {
			return this.model().row_sets( id )
		}

		override excercise_plan( id: any ): readonly ( number )[] {
			return this.model().plan( id )
		}

		override excercise_title_extra_extra( id: any ): string {
			return this.model().row_exercise_extra_extra ( id )
		}

		override excercise_title_extra_title( id: any ): string {
			return this.model().row_exercise_extra_title( id )
		}

		override day_name(): string {
			return `${ super.day_name() }${ this.day_idx() + 1 }`
		}

		override sub() {
			const items = [ ...super.sub() ]

			this.model().data_ids().forEach( ( id ) => {
				items.push( this.ExcerciseTable( id ) )
			} )

			return items
		}
	}

	export class $tukanable_gymload_builder_export_print_table extends $.$tukanable_gymload_builder_export_print_table {
		override set_rows(): readonly ( $mol_view )[] {
			const items: $mol_view[] = []

			for( let i = 0; i < this.sets(); i++ ) {
				items.push( this.SetRow( i ) )
			}

			return items
		}

		override header_content( id: any ) {
			return id
		}

		override header_cells(): readonly ( $mol_view )[] {
			const items: $mol_view[] = []

			items.push( this.HeaderCell( '' ) )

			for( let i = 0; i < this.plan().length; i++ ) {
				items.push( this.HeaderCell( this.header_content( i + 1 ) ) )
			}

			return items
		}

		override set_idx( id: any ): string {
			return id + 1
		}

		override result_begin( id: any ): string {
			const [ , weight ] = id.split( '_' )

			return `${ weight } (`
		}

		override result_end( id: any ): string {
			return ')'
		}

		override columns( id: any ): readonly ( $mol_view )[] {
			const items: $mol_view[] = [
				this.SetCell( id ),
			]

			this.plan().forEach( ( w, i ) => {
				items.push( this.ResultCell( `${ id }_${ w }_${ i }` ) )
			} )

			return items
		}
	}
}
