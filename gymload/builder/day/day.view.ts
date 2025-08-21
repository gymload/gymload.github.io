namespace $.$$ {
	type NewItem = {
		excercise: string
		weight_type: 'custom' | 'barbell' | 'dumbbell'
		sets: number
		reps: number
		begin_weight: number
		finish_weight: number
		min_step: number
		barbell_weight?: number
	}

	const empty_item: NewItem = {
		excercise: '',
		weight_type: 'custom',
		sets: 3,
		reps: 12,
		begin_weight: 20,
		finish_weight: 50,
		min_step: 5,
	}

	export class $tukanable_gymload_builder_day extends $.$tukanable_gymload_builder_day {
		override minimal_width(): number {
			return Math.min( 800, $mol_view_visible_width() )
		}

		// override maximal_width(): number {
		// 	return 1000
		// }

		build_key( s: string ) {
			return `${ this.storage_key() }_${ s }`
		}

		all_data_ids( next?: number[] ): readonly ( number )[] {
			return this.$.$mol_state_local.value( this.build_key( 'ids' ), next ) || []
		}

		deleted_data_ids( next?: number[] ): readonly ( number )[] {
			return this.$.$mol_state_local.value( this.build_key( 'deleted_ids' ), next ) || []
		}

		override data_ids( next?: number[] ): readonly ( number )[] {
			const ids = this.all_data_ids( next )
			const deleted_ids = this.deleted_data_ids()
			return ids.filter( id => !deleted_ids.includes( id ) )
		}

		override rows() {
			return this.data_ids().map( id => this.Row( id ) )
		}

		row( id: any, next?: NewItem | null ): NewItem {
			const key = this.build_key( `item_${ id }` )
			if( next === undefined ) {
				return this.$.$mol_state_local.value<NewItem>( key ) || empty_item
			}

			this.$.$mol_state_local.value<NewItem>( key, next )

			return next || empty_item
		}

		@$mol_mem_key
		override plan( id: any ) {
			const res: number[] = []
			const count = this.week_count()
			const begin_weight = this.row_begin_weight( id )
			const finish_weight = this.row_finish_weight( id )
			const min_step = this.row_min_step( id )
			const weight_type = this.row_weight_type( id )

			let min_weight = this.row_min_weight( id )
			if( weight_type === 'barbell' ) {
				min_weight = this.row_barbell_weight( id )
			}

			for( let i = 0; i < count; i++ ) {
				const progress = i / ( count - 1 )

				// sigmoid by default
				let factor = 1 - Math.pow( 1 - progress, 2 )

				switch( this.progress_formula() ) {
					case 'linear':
						factor = progress
						break

					case 'log':
						factor = Math.log1p( progress * 9 ) / Math.log1p( 9 )
				}

				const weight = begin_weight + ( finish_weight - begin_weight ) * factor

				let aligned_weight = Math.round( ( weight - min_weight ) / min_step ) * min_step + min_weight

				switch( this.row_weight_type( id ) ) {
					case 'dumbbell':
						aligned_weight = this.closest_dumbell_value( weight )
						break
				}

				aligned_weight = Math.round( aligned_weight * 100 ) / 100

				res.push( Math.max( aligned_weight, min_weight ) )
			}

			return res
		}

		closest_dumbell_value( val: number ) {
			return this.dumbbell_values().reduce( ( prev, curr ) => {
				return Math.abs( curr - val ) < Math.abs( prev - val ) ? curr : prev
			}, this.min_dumbbell_weight() )
		}

		override day_title(): string {
			return super.day_title() + ( this.day_index() + 1 ).toString()
		}

		override week_labels( id: any ): readonly ( string )[] {
			const weights = this.plan( id )
			return weights.map( ( w, i ) => `${ i + 1 }: ${ w }` )
		}

		override row_exercise_title( id: any ) {
			return super.row_exercise_title( id ) + id.toString()
		}

		override row_remove( id: any ) {
			this.deleted_data_ids( [ ...this.deleted_data_ids(), id ] )
			// this.data_ids( this.data_ids().filter( item => item !== id ) )
			// this.row( id, null )
		}

		change_field<K extends keyof NewItem>( key: K, id: any, next?: NewItem[ K ] ): NewItem[ K ] {
			if( next !== undefined ) {
				const newRow = this.row( id, {
					...this.row( id ),
					[ key ]: next,
				} )

				return newRow[ key ]
			}

			return this.row( id )[ key ]
		}

		override row_exercise( id: any, next?: string ) {
			return this.change_field( 'excercise', id, next )
		}

		override row_sets( id: any, next?: number ) {
			return this.change_field( 'sets', id, next )
		}

		override row_reps( id: any, next?: number ) {
			return this.change_field( 'reps', id, next )
		}

		override row_begin_weight( id: any, next?: number ) {
			if( this.start_percent_valid() ) {
				return Math.max(
					this.row_finish_weight( id ) * this.start_percent() / 100,
					this.row_min_weight( id ),
				)
			}

			const v = this.change_field( 'begin_weight', id, next )
			return Math.max( v, this.row_min_weight( id ) )
		}

		override row_finish_weight( id: any, next?: number ) {
			const v = this.change_field( 'finish_weight', id, next )
			return Math.max( v, this.row_min_weight( id ) )
		}

		override row_min_step( id: any, next?: number ) {
			const v = this.change_field( 'min_step', id, next )
			const wt = this.row_weight_type( id )

			if( wt === 'dumbbell' ) {
				return this.min_dumbbell_weight()
			}

			if( wt === 'barbell' ) {
				return this.min_weight_plate() * 2
			}

			return Math.max( v, 0.1 )
		}

		barbell_present() {
			return this.weight_plate_values().length > 0 && this.barbell_values().length > 0
		}

		dumbbell_present() {
			return this.dumbbell_values().length > 0
		}

		min_weight_plate() {
			return Math.min( ...this.weight_plate_values() )
		}

		min_dumbbell_weight() {
			return Math.min( ...this.dumbbell_values() )
		}

		min_barbell_weight() {
			return Math.min( ...this.barbell_values() )
		}

		override row_weight_type( id: any, next?: string ): string {
			let v = this.change_field( 'weight_type', id, next as NewItem[ 'weight_type' ] ) || empty_item.weight_type

			if( v === 'barbell' && !this.barbell_present() ) {
				v = 'custom'
			}

			if( v === 'dumbbell' && !this.dumbbell_present() ) {
				v = 'custom'
			}

			return v
		}

		override row_weight_types( id: any ): Record<string, string> {
			const labels = { ...this.weight_types() }
			const res: Record<string, string> = { ...this.weight_types() }

			if( !this.dumbbell_present() ) {
				delete res[ 'dumbbell' ]
			}

			if( !this.barbell_present() ) {
				delete res[ 'barbell' ]
			}

			return res
		}

		override min_step_labeler( id: any ): $mol_view | null {
			if( this.row_weight_type( id ) === 'custom' ) {
				return this.MinStepLabeler( id )
			}

			return null
		}

		start_percent_valid(): boolean {
			const v = this.start_percent()
			return !isNaN( v ) && v > 0 && v < 100
		}

		override begin_weight_labeler( id: any ): $mol_view | null {
			if( !this.start_percent_valid() ) {
				return this.BeginWeightLabeler( id )
			}

			return null
		}

		row_min_weight( id: any ): number {
			switch( this.row_weight_type( id ) ) {
				case 'barbell':
					return this.min_barbell_weight()

				case 'dumbbell':
					return this.min_dumbbell_weight()
			}

			return 0 // custom
		}

		@$mol_mem
		new_id() {
			return Math.max( 1, 1 + Math.max( ... this.data_ids() ) )
		}

		override add_exercise( e: PointerEvent ) {
			const ids = this.data_ids()
			const new_id = this.new_id()
			const last_id = ids[ ids.length - 1 ]
			const new_item: NewItem = { ...empty_item }

			if( last_id !== undefined ) {
				const last_row = this.row( last_id )
				new_item.sets = last_row.sets
				new_item.reps = last_row.reps
				new_item.min_step = last_row.min_step
				new_item.weight_type = last_row.weight_type
			}

			this.data_ids( [ ...this.data_ids(), new_id ] )
			this.row( new_id, new_item )

			const t = e.target as HTMLDivElement
			if( !t ) {
				return
			}

			setTimeout( () => {
				t.scrollIntoView( { behavior: "smooth", block: "end" } ) // @ts-ignore
			}, 1 )
		}

		override row_view( id: any ) {
			const items = [
				...super.row_view( id ),
				this.PlanWeights( id ),
			]

			if( this.show_charts() ) {
				items.push( this.ChartView( id ) )
			}

			return items
		}

		override row_exercise_extra( id: any ): string {
			return `${ this.row_exercise_extra_title( id ) } ${ this.row_exercise_extra_extra( id ) }`
		}

		override row_exercise_extra_title( id: any ): string {
			return this.row_exercise( id ) || this.excercise_without_name()
		}

		override row_exercise_extra_extra( id: any ): string {
			const sets = this.row_sets( id )
			const reps = this.row_reps( id )

			return `${ sets }x${ reps }`
		}

		@$mol_mem_key
		possible_weights_for_barbell( barbell_weight: number ) {
			const plates = this.weight_plate_values()
			const possible = new Set<number>()

			// only a barbell
			possible.add( barbell_weight )

			const max_plates_per_weight = 6

			const generateCombinations = ( index: number, current_weight: number ) => {
				if( index >= plates.length ) {
					possible.add( current_weight )
					return
				}

				for( let count = 0; count <= max_plates_per_weight; count++ ) {
					const added_weight = plates[ index ] * 2 * count // *2 так как блины с двух сторон
					generateCombinations( index + 1, current_weight + added_weight )
				}
			}

			generateCombinations( 0, barbell_weight )

			return Array.from( possible ).sort( ( a, b ) => a - b )
		}

		override barbell_weight_labeler( id: any ) {
			if( this.row_weight_type( id ) === 'barbell' ) {
				return this.BarbellWeightLabeler( id )
			}

			return null
		}

		@$mol_mem
		override barbell_value_strings() {
			return this.barbell_values().map( v => v.toString() )
		}

		@$mol_mem
		default_row_barbell_weight() {
			return Math.max( 0, ...this.barbell_values() )
		}

		row_barbell_weight( id: any, next?: number ) {
			return this.change_field( 'barbell_weight', id, next ) || this.default_row_barbell_weight()
		}

		override row_barbell_weight_string( id: any, next?: string ) {
			let v: number | undefined

			if( next !== undefined ) {
				v = parseInt( next, 10 ) || this.default_row_barbell_weight()
			}

			return this.row_barbell_weight( id, v ).toString()
		}

		override deleted_rows(): readonly ( $mol_view )[] {
			return this.deleted_data_ids().map( id => this.DeletedRow( id ) )
		}

		override row_restore( id: any ) {
			this.deleted_data_ids( this.deleted_data_ids().filter( item => item !== id ) )
		}

		override sort_rows(): readonly ( $mol_view )[] {
			return this.data_ids().map( id => this.SortRow( id ) )
		}

		override sort_transfer_adopt( transfer: DataTransfer ) {
			const uri = transfer.getData( "text/uri-list" )
			if( !uri ) return

			return this.data_ids().find( id => this.sort_row_uri( id ) === uri )
		}

		@$mol_mem_key
		sort_row_uri( id: any ) {
			return this.$.$mol_state_arg.make_link( {
				... this.$.$mol_state_arg.dict(),
				'day': this.day_index().toString(),
				'eid': id.toString(),
			} )
		}

		override sort_receive_before( anchor: any, item_id: any ) {
			if( anchor === item_id ) return

			const original_ids = this.data_ids()
			const original_item_index = original_ids.indexOf( item_id )
			const original_anchor_index = original_ids.indexOf( anchor )

			const ids = original_ids.filter( p => p !== item_id )
			const anchor_index = ids.indexOf( anchor )

			if( original_item_index < original_anchor_index ) {
				ids.splice( anchor_index + 1, 0, item_id )
			} else {
				ids.splice( anchor_index, 0, item_id )
			}

			this.data_ids( ids )
		}

		override info_tabs() {
			const items: $mol_view[] = []

			if( this.data_ids().length > 1 ) {
				items.push( this.SortExercises() )
			}

			if( this.deleted_data_ids().length > 0 ) {
				items.push( this.DeletecExercises() )
			}

			return items
		}
	}
}
