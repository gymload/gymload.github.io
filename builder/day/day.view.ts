namespace $.$$ {
	type NewItem = {
		excercise: string
		sets: number
		reps: number
		begin_weight: number
		finish_weight: number
		min_step: number
	}

	const empty_item: NewItem = {
		excercise: '',
		sets: 3,
		reps: 12,
		begin_weight: 20,
		finish_weight: 50,
		min_step: 5,
	}

	export class $gymload_builder_day extends $.$gymload_builder_day {
		build_key(s :string) {
			return this.state_key( `gymload_builder_v1_${this.day_index()}_${ s }` )
		}

		data_ids( next?: number[] ): number[] {
			return this.$.$mol_state_local.value( this.build_key( 'excercise_ids' ), next ) || []
		}

		override rows() {
			return this.data_ids().map( id => this.Row( id ) )
		}

		row( id: any, next?: NewItem ): NewItem {
			const key = this.build_key( `excercise_${ id }` )
			if( next === undefined ) {
				return this.$.$mol_state_local.value<NewItem>( key ) || empty_item
			}

			this.$.$mol_state_local.value<NewItem>( key, next )

			return next
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

		@$mol_mem_key
		override row_exercise( id: any, next?: string ) {
			return this.change_field( 'excercise', id, next )
		}

		@$mol_mem_key
		override row_sets( id: any, next?: number ) {
			return this.change_field( 'sets', id, next )
		}

		@$mol_mem_key
		override row_reps( id: any, next?: number ) {
			return this.change_field( 'reps', id, next )
		}

		@$mol_mem_key
		override row_begin_weight( id: any, next?: number ) {
			return this.change_field( 'begin_weight', id, next )
		}

		@$mol_mem_key
		override row_finish_weight( id: any, next?: number ) {
			return this.change_field( 'finish_weight', id, next )
		}

		@$mol_mem_key
		override row_min_step( id: any, next?: number ) {
			return this.change_field( 'min_step', id, next )
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
			}

			this.data_ids( [ ...this.data_ids(), new_id ] )
			this.row( new_id, new_item )
		}
	}
}
