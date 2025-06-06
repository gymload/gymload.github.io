namespace $.$$ {
	export class $gymload_builder_day_results_set extends $.$gymload_builder_day_results_set {
		override sub() {
			const items: $mol_view[] = [ ...super.sub() ]

			if( this.week_idx() > 0 ) {
				items.push( this.PastWeekView() )
			}

			const w = this.week_weight_value( this.week_idx() )

			if( w < 0 ) {
				items.push( this.DoneWeekView() )
			} else {
				items.push( this.CurrentWeekView() )
			}

			if( this.week_idx() < this.week_count() - 1 ) {
				items.push( this.FutureWeekView() )
			}

			return items
		}

		override done_week_click() {
			this.week_weight_value( this.week_idx(), this.plan_weight() )
		}

		override done_plan_label(): string {
			return `Plan: ${ this.plan_weight() } (${ this.reps() })`
		}

		override past_week_results() {
			if( this.week_idx() === 0 ) {
				return '???'
			}

			const w = Math.max(
				this.week_weight_value( this.week_idx() - 1 ),
				this.plan()[ this.week_idx() - 1 ] || -1,
			)

			const reps = this.reps()

			return `${ w } (${ reps })`
		}

		override future_week_results() {
			if( this.week_idx() === this.week_count() - 1 ) {
				return '???'
			}

			const w = Math.max(
				this.week_weight_value( this.week_idx() + 1 ),
				this.plan()[ this.week_idx() + 1 ] || -1,
			)

			const reps = this.reps()

			return `${ w } (${ reps })`
		}

		override week_plan_weight(): string {
			return `Weight: ${ this.plan_weight() }`
		}

		plan_weight() {
			return this.plan()[ this.week_idx() ] || -1
		}

		build_key( week_idx: number, prop_name: string ): string {
			return `${ this.storage_key() }_${ this.excercise_idx() }_${ week_idx }_${ this.set_idx() }_${ prop_name }`
		}

		week_weight_value( week_idx: number, next?: number ): number {
			return this.$.$mol_state_local.value( this.build_key( week_idx, 'weight' ), next ) || -1
		}

		week_reps_value( week_idx: number, next?: number ): number {
			return this.$.$mol_state_local.value( this.build_key( week_idx, 'reps' ), next ) || -1
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

		override week_reps( next?: number ): number {
			if( next !== undefined ) {
				return this.week_reps_value( this.week_idx(), next )
			}

			const defaultValue = Math.max(
				this.week_reps_value( this.week_idx() ),
				this.reps(),
			)

			return next || defaultValue
		}
	}
}