namespace $.$$ {
	export class $gymload_builder_day_results_set extends $.$gymload_builder_day_results_set {
		override sub() {
			const items: $mol_view[] = [ ...super.sub() ]

			if (this.week_idx() > 0) {
				items.push( this.PastWeekView() )
			}

			items.push( this.CurrentWeekView() )

			if (this.week_idx() < this.week_count() - 1) {
				items.push( this.FutureWeekView() )
			}

			return items
		}

		override past_week_results() {
			return '20 (10)'
		}

		override future_week_results() {
			return '30 (10)'
		}

		override week_weight( next?: number ): number {
			return next || this.plan()[this.week_idx()] || 0
		}
	}
}