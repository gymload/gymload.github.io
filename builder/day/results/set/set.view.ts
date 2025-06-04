namespace $.$$ {
	export class $gymload_builder_day_results_set extends $.$gymload_builder_day_results_set {
		override sub() {
			const items: $mol_view[] = [ ...super.sub() ]

			if( this.week_idx() > 0 ) {
				items.push( this.PastWeekView() )
			}

			items.push( this.CurrentWeekView() )

			if( this.week_idx() < this.week_count() - 1 ) {
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

		override week_plan_weight(): string {
			return `Weight: ${ this.plan_weight() }`
		}

		plan_weight() {
			return this.plan()[ this.week_idx() ] || -1
		}

		week_weight_value( week_idx: number, next?: number ): number {
			const key = `gymload_builder_v1_results_${ this.excercise_idx() }_${ week_idx }_${ this.set_idx() }`
			return this.$.$mol_state_local.value( key, next ) || -1
		}

		override week_weight( next?: number ): number {
			if( next !== undefined ) {
				return this.week_weight_value( this.week_idx(), next )
			}

			const defaultValue = Math.max(
				this.week_weight_value( this.week_idx() ),
				this.plan_weight(),
			)

			return next || defaultValue
		}
	}
}