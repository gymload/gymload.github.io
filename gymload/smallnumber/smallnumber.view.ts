namespace $.$$ {
	export class $tukanable_gymload_smallnumber extends $.$tukanable_gymload_smallnumber {
		override click( e: MouseEvent ) {
			const el = e.target as HTMLInputElement
			if( el.tagName === 'INPUT' ) {
				el.select()
			}
		}
	}
}
