namespace $.$$ {
	type Item = {
		id: number
		excercise: string
		sets: number
		reps: number
		begin_weight: number
		finish_weight: number
		min_step: number
	}

	const data_key = 'gymload_builder_data'

	export class $gymload_builder extends $.$gymload_builder {
		@$mol_mem
		data( next?: Item[] ): Item[] {
			return this.$.$mol_state_local.value<Item[]>( data_key, next ) || []
		}

		override rows() {
			return this.data().map( item => this.Row( item.id ) )
		}

		row( id: any ) {
			return this.data()[ id - 1 ]
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

		override week_labels( id: any ): readonly ( string )[] {
			const weights = this.plan( id )
			return weights.map( ( w, i ) => `${i+1}: ${w}` )
		}

		override row_exercise_title( id: any ) {
			const r = this.row( id )
			return `${ r.excercise } #${ r.id }`
		}

		override row_remove( id: any ) {
			this.data( this.data().filter( item => item.id !== id ) )
		}

		change_field<K extends keyof Item>(key: K, id: any, next?: Item[K]): Item[K] {
			const row = this.row( id )

			if( next !== undefined ) {
				const newRow = { ...row, [key]: next }
				this.data( this.data().map( item => item.id === id ? newRow : item ) )
			}

			return row[ key ]
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

		override add_exercise() {
			this.data( [
				...this.data(),
				{
					id: this.data().length + 1,
					excercise: 'Приседания',
					sets: 3,
					reps: 10,
					begin_weight: 50,
					finish_weight: 100,
					min_step: 5,
				},
			] )
		}
	}
}
