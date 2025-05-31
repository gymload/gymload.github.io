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

	export class $gymload_builder_day extends $.$gymload_builder_day {
		build_key( s: string ) {
			return this.state_key( `gymload_builder_v1_${ this.day_index() }_${ s }` )
		}

		data_ids( next?: number[] ): number[] {
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
			const res = []
			const count = this.week_count()
			const row = this.row( id )
			const base = row.finish_weight / row.begin_weight
			for( let i = 0; i < count; i++ ) {
				const progress = i / ( count - 1 )
				const weight = row.begin_weight * Math.pow( base, progress )
				const aligned_weight = Math.round( weight / row.min_step ) * row.min_step

				res.push( aligned_weight )
			}
			return res
		}

		override day_title(): string {
			return `Day #${ this.day_index() + 1 }`
		}

		override week_labels( id: any ): readonly ( string )[] {
			const weights = this.plan( id )
			return weights.map( ( w, i ) => `${ i + 1 }: ${ w }` )
		}

		override row_exercise_title( id: any ) {
			return `Exercise #${ id }`
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
			return this.change_field( 'begin_weight', id, next )
		}

		override row_finish_weight( id: any, next?: number ) {
			return this.change_field( 'finish_weight', id, next )
		}

		override row_min_step( id: any, next?: number ) {
			return this.change_field( 'min_step', id, next )
		}

		override row_weight_type( id: any, next?: string ): string {
			let v = this.change_field( 'weight_type', id, next as NewItem[ 'weight_type' ] ) || empty_item.weight_type

			if ( v === 'barbell' && this.weight_plate_values().length === 0 ) {
				v = 'custom'
			}

			if ( v === 'dumbbell' && this.dumbbell_values().length === 0 ) {
				v = 'custom'
			}

			return v
		}

		override row_weight_types( id: any ): Record<string, string> {
			const res: Record<string, string> = { 'custom': 'Custom' }

			if( this.dumbbell_values().length > 0 ) {
				res[ 'dumbbell' ] = 'Dumbbell'
			}

			if( this.weight_plate_values().length > 0 ) {
				res[ 'barbell' ] = 'Barbell'
			}

			return res
		}

		override min_step_labeler( id: any ): $mol_view | null {
			if (this.row_weight_type( id ) === 'custom') {
				return this.MinStepLabeler( id )
			}

			return null
		}

		row_min_weight( id: any ): number {
			switch( this.row_weight_type( id ) ) {
				case 'barbell':
					return Math.min( ...this.dumbbell_values() )

				case 'dumbbell':
					return Math.min( ...this.weight_plate_values() ) * 2
			}

			return 0 // custom
		}

		@$mol_mem
		new_id() {
			return Math.max( 1, 1 + Math.max( ... this.data_ids() ) )
		}

		override add_exercise() {
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
		}
	}
}
