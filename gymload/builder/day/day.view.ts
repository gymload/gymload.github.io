namespace $.$$ {
	type NewItem = {
		excercise: string
		weight_type: 'custom' | 'barbell' | 'dumbbell'
		sets: number
		reps: number
		begin_weight: number
		finish_weight: number
		min_step: number
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
		build_key( s: string ) {
			return `${ this.storage_key() }_${ s }`
		}

		override data_ids( next?: number[] ): readonly ( number )[] {
			return this.$.$mol_state_local.value( this.build_key( 'ids' ), next ) || []
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
			const min_weight = this.row_min_weight( id )
			const min_step = this.row_min_step( id )

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
				const aligned_weight = Math.floor( weight / min_step ) * min_step

				res.push( Math.max( aligned_weight, min_weight ) )
			}

			return res
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
			this.data_ids( this.data_ids().filter( item => item !== id ) )
			this.row( id, null )
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
	}
}
