namespace $.$$ {
	export class $tukanable_gymload_builder_day_planweights extends $.$tukanable_gymload_builder_day_planweights {
		override weights(): string {
			return `${ super.weights() } ${ this.values().join( ', ' ) }`
		}
	}
}