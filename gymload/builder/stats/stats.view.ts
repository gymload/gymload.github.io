namespace $.$$ {
	export class $tukanable_gymload_builder_stats extends $.$tukanable_gymload_builder_stats {
		override value() {
			let totalWeight = 0

			for( let i = 0; i < this.day_count(); i++ ) {
				const day = this.model( i )
				const ids = day.data_ids()

				for( const id of ids ) {
					const sets = day.row_sets( id )
					const plan = day.plan( id )

					totalWeight += plan.reduce( ( acc, w ) => acc + w * sets, 0 )
				}
			}

			return `Total weight lifted: ${totalWeight} kg`
		}
	}
}