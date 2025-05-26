namespace $.$$ {
	type Item = {
		id: number
		excercise: string
		sets: number
		reps: number
		beginWeight: number
		finishWeight: number
		minSteps: number
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

		override plan( id: any ) {
			const res = []
			const count = this.week_count()
			for( let i = 0; i < count; i++ ) {
				res.push( i + 1 )
			}
			return res
		}

		override row_exercise_title( id: any ) {
			const r = this.row( id )
			return `${ r.excercise } #${ r.id }`
		}

		override add_exercise() {
			this.data( [
				...this.data(),
				{
					id: this.data().length + 1,
					excercise: 'Приседания',
					sets: 3,
					reps: 10,
					beginWeight: 50,
					finishWeight: 100,
					minSteps: 5,
				},
			] )
		}
	}
}
