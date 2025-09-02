namespace $.$$ {
	export class $tukanable_gymload_page_exerciseparams extends $.$tukanable_gymload_page_exerciseparams {
		override sets() {
			return parseInt(this.$.$mol_state_arg.value( 'sets' ) || '3', 10)
		}

		override reps() {
			return parseInt(this.$.$mol_state_arg.value( 'reps' ) || '10', 10)
		}

		override help_text() {
			return super.help_text()
				.replace( /\$S/g, this.sets().toString() )
				.replace( /\$R/g, this.reps().toString() )
		}
	}
}
