namespace $.$$ {
	export class $tukanable_gymload_builder_day_results_set extends $.$tukanable_gymload_builder_day_results_set {
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
			return super.done_plan_label().replace( '__weight__', this.plan_weight().toString() ).replace( '__reps__', this.reps().toString() )
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
			return `${ super.week_plan_weight() }${ this.plan_weight() }`
		}

		override week_plan_reps(): string {
			return `${ super.week_plan_reps() }${ this.reps() }`
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

			let v = this.week_weight_value( this.week_idx() )
			if (v < 0) {
				v = this.plan_weight()
			}

			return next || v
		}

		override week_reps( next?: number ): number {
			if( next !== undefined ) {
				return this.week_reps_value( this.week_idx(), next )
			}

			let v = this.week_reps_value( this.week_idx() )
			if( v < 0 ) {
				v = this.reps()
			}

			return next || v
		}

		override set_idx_label(): string {
			return `${ super.set_idx_label() }${ Number( this.set_idx() ) + 1 }`
		}
	}
}
