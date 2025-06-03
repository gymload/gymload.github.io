namespace $.$$ {
	export class $gymload_builder_day_results_set extends $.$gymload_builder_day_results_set {
		override sub() {
			const items: $mol_view[] = [ ...super.sub() ]

			if (this.week_idx() > 0) {
				items.push( this.PastWeek_labeler() )
			}

			items.push( this.CurrentWeek_labeler() )

			if (this.week_idx() < this.week_count() - 1) {
				items.push( this.FutureWeek_labeler() )
			}

			return items
		}
	}
}