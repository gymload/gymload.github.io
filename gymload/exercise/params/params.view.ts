namespace $.$$ {
	export class $tukanable_gymload_exercise_params extends $.$tukanable_gymload_exercise_params {
		override uri() {
			return this.$.$mol_state_arg.make_link( {
				nav: 'exerciseparams',
				sets: this.sets().toString(),
				reps: this.reps().toString(),
			} )
		}

		override sub() {
			if (this.idx() === null || this.idx() === 0) {
				return super.sub()
			}

			return []
		}
	}
}
