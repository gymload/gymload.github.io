namespace $.$$ {
	export class $tukanable_gymload_page_templates extends $.$tukanable_gymload_page_templates {
		run( next?: any ) {
			const data = this.$.$mol_fetch.json( `tukanable/gymload/templates.json` )
			console.log("Run template", data)
		}
	}
}
