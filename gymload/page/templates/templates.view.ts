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

		@$mol_mem
		override spreads() {
			const pages = super.spreads()

			this.data().items.forEach( item => {
				pages[ item.id ] = this.Page( item.id )
			} )

			return pages
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

	}

	export class $tukanable_gymload_page_templates_details extends $.$tukanable_gymload_page_templates_details {
		lang_str( val: LangStr ) {
			if( typeof val === 'string' ) return val
			const lang = this.$.$mol_locale.lang()
			return val[ lang ] ?? val[ 'en' ] ?? Object.values( val )[ 0 ] ?? ''
		}

		override row() {
			const row = super.row() as Template
			if( !row ) throw new Error( 'row not set' )
			return row
		}

		override row_name() {
			return this.lang_str( this.row().name )
		}

		override row_description() {
			return this.lang_str( this.row().description )
		}

		override import() {
			const data = $mol_wire_sync( $tukanable_gymload_page_export ).compress( this.row().data )
			const url = $tukanable_gymload_page_export.data_url( data )
			this.$.$mol_state_arg.href( url )
		}

		@$mol_mem
		data() {
			type Exercise = {
				exercise: string
				sets: number
				reps: number
			}

			const raw = this.row().data
			const days: { [ key: string ]: string[] } = {} // list of keys
			const exercises: Exercise[] = []

			Object.keys( raw ).forEach( key => {
				// _v1_day_0_item_1
				const m = key.match( /_v1_day_(\d+)_item_(\d+)/ )
				if( m ) {
					const day = parseInt( m[ 1 ], 10 )
					const item = parseInt( m[ 2 ], 10 )

					if( !days[ day ] ) days[ day ] = []

					days[ day ].push( exercises.length.toString() )
					exercises.push(raw[ key ] as Exercise)
				}
			} )

			return { days, exercises }
		}

		@$mol_mem
		override days() {
			return Object.keys( this.data().days ).map( key => this.DayRow(key) )
		}

		override day_name( id: any ): string {
			return `${super.day_name(id)}${parseInt(id, 10) + 1}`
		}

		override exercises( id: any ) {
			return this.data( ).days[id].map( key => this.ExerciseRow( key ) )
		}

		exercise(id: any) {
			return this.data().exercises[ this.exercise_idx(id) ]
		}

		override exercise_idx( id: any ) {
			return parseInt(id, 10)
		}

		override exercise_sets( id: any ): number {
			return this.exercise(id).sets
		}

		override exercise_reps( id: any ): number {
			return this.exercise(id).reps
		}
	}
}
