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

		done_weight() {
			if( this.set_idx() > 0 ) {
				const prev_weight = this.week_weight_value( this.week_idx(), undefined, this.set_idx() - 1 )
				if ( prev_weight >= 0 ) {
					return prev_weight
				}
			}

			return this.plan_weight()
		}

		override done_week_click() {
			this.week_weight_value( this.week_idx(), this.done_weight() )
			this.week_reps( this.default_reps() ) // immediately save to storage
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

		build_key( week_idx: number, prop_name: string, set_idx: number = this.set_idx() ): string {
			return `${ this.storage_key() }_${ this.excercise_idx() }_${ week_idx }_${ set_idx }_${ prop_name }`
		}

		week_weight_value( week_idx: number, next?: number, set_idx: number = this.set_idx() ): number {
			const v = this.$.$mol_state_local.value( this.build_key( week_idx, 'weight', set_idx ), next ) || -1

			if( v < 0 ) {
				// the previous code stored the weight for all sets in the same key
				const old_value = this.$.$mol_state_local.value( this.build_key( week_idx, 'weigth' ) )
				if( typeof old_value === 'number' && old_value >= 0 ) {
					return old_value
				}
			}

			return Math.round( v * 10 ) / 10
		}

		week_reps_value( week_idx: number, next?: number, set_idx?: number ): number {
			return this.$.$mol_state_local.value( this.build_key( week_idx, 'reps', set_idx ), next ) || -1
		}

		override week_weight( next?: number ): number {
			if( next !== undefined ) {
				return this.week_weight_value( this.week_idx(), next )
			}

			let v = this.week_weight_value( this.week_idx() )
			if( v < 0 ) {
				v = this.plan_weight()
			}

			return next || v
		}

		default_reps() {
			if( this.set_idx() > 0 ) {
				const prev = this.week_reps_value( this.week_idx(), undefined, this.set_idx() - 1 )
				return prev || this.reps()
			}

			return this.reps()
		}

		override week_reps( next?: number ): number {
			if( next !== undefined ) {
				return this.week_reps_value( this.week_idx(), next )
			}

			let v = this.week_reps_value( this.week_idx() )
			if( v < 0 ) {
				v = this.default_reps()
			}

			return next || v
		}

		override set_idx_label(): string {
			return `${ super.set_idx_label() }${ Number( this.set_idx() ) + 1 }`
		}
	}
}
