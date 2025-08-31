namespace $.$$ {
	/*
	const str = $mol_data_string
	const optional = $mol_data_optional

	const lang_obj = $mol_data_record({
		en: optional(str),
		ru: optional(str),
	})

	const lang_str = $mol_data_variant(str, lang_obj)

	const ItemDTO = $mol_data_record({
		id : str,
		name : lang_str,
		description : lang_str,
		data: $mol_data_dict($mol_data_variant),
	})
	*/

	type LangStr = string | { [ lang: string ]: string }

	type Template = {
		id: string
		name: LangStr
		description: LangStr
		data: { [ key: string ]: any }
	}

	type DataFile = {
		items: Template[]
	}

	const getLangStr = ( val: LangStr ) => {
		if( typeof val === 'string' ) return val
		return val[ 'en' ] ?? Object.values( val )[ 0 ] ?? ''
	}

	export class $tukanable_gymload_page_templates extends $.$tukanable_gymload_page_templates {
		@$mol_mem
		data() {
			return this.$.$mol_fetch.json( `tukanable/gymload/templates.json` ) as DataFile
		}

		override rows(): readonly ( $mol_view )[] {
			return this.data().items.map( item => this.Row( item.id ) )
		}

		@$mol_mem_key
		row( id: string ) {
			return this.data().items.find( item => item.id === id )!
		}

		lang_str( val: LangStr ) {
			if( typeof val === 'string' ) return val
			const lang = this.$.$mol_locale.lang()
			return val[ lang ] ?? val[ 'en' ] ?? Object.values( val )[ 0 ] ?? ''
		}

		override row_name( id: string ) {
			return this.lang_str( this.row( id ).name )
		}

		override row_description( id: string ) {
			return this.lang_str( this.row( id ).description )
		}

		override row_day_count( id: any ): string {
			return this.row( id ).data?._v1_day_count ?? ''
		}

		override import( id: any ) {
			const data = $mol_wire_sync( $tukanable_gymload_page_export ).compress( this.row( id ).data )
			const url = $tukanable_gymload_page_export.data_url( data )
			this.$.$mol_state_arg.href( url )
		}
	}
}
