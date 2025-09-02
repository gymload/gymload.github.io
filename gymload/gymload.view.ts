namespace $.$$ {
	const defaultProgramId = 0

	export class $tukanable_gymload extends $.$tukanable_gymload {
		override Spread_default() {
			return this.spreads()[ 'builder' ]
		}

		override spreads() {
			const days: any = {}
			const programs: any = {}
			const program_ids = this.program_ids()

			for( let i = 0; i < this.day_count(); i++ ) {
				days[ `day${ i + 1 }` ] = this.DayResultsPage( i )
			}

			const spreads = { ...super.spreads() } as any

			if( this.program_ids().length < 2 ) {
				delete spreads[ 'editprogram' ]
			}

			if( this.day_count() === 0 ) {
				delete spreads[ 'print' ]
				delete spreads[ 'stats' ]
				delete spreads[ 'export' ]
				delete spreads[ 'newprogram' ]
			}

			return {
				...days,
				...spreads,
			}
		}

		override day_results_title( id: any ) {
			return `${ super.day_results_title( id ) }${ id + 1 }`
		}

		override day_results_body( id: any ): $mol_view {
			return this.DayResults( id )
		}

		override spread_title( spread: string ) {
			const page = this.Spread( spread )
			return page instanceof $tukanable_gymload_page
				&& page.menu_title()
				|| super.spread_title( spread )
		}

		override menu_links() {
			const ids = this.spread_ids_filtered()

			// hide delete links from menu
			return super.menu_links().filter( ( link, idx ) => {
				const page = this.Spread( ids[ idx ] )
				if (page instanceof $tukanable_gymload_page) {
					return !page.hide_in_menu()
				}

				return true
			} )
		}

		override programs() {
			const res: { [ key: string ]: string } = {}

			this.program_ids().forEach( id => {
				res[ id ] = this.program_name( id )
			} )

			return res
		}

		override current_program_string( next?: string ): string {
			if( next !== undefined ) {
				this.current_program( parseInt( next, 10 ) )
			}

			return this.current_program().toString()
		}

		current_program( next?: number ): number {
			return this.$.$mol_state_local.value( this.build_key( 'current_program' ), next ) || defaultProgramId
		}

		override menu_tools() {
			const items = [ ...super.menu_tools() ]

			if( this.user_program_ids().length > 0 ) {
				items.push( this.ListPrograms() )
			}

			return items
		}

		override new_name_bid(): string {
			return this.new_name().trim().length === 0 ? this.required_label() : ''
		}

		override edit_name_bid(): string {
			return this.edit_name().trim().length === 0 ? this.required_label() : ''
		}

		override add_program() {
			const id = this.new_program_id()

			this.program_ids( [ ...this.program_ids(), id ] )
			this.program_name( id, this.new_name() )

			this.current_program( id )
			this.to_default_page()

			if( this.new_import_data().trim() !== '' ) {
				$tukanable_gymload_page_export.inject( this.builder_storage_key(), this.new_import_data().trim() )
			}
		}

		override edit_program() {
			this.program_name( this.current_program(), this.edit_name() )
			this.to_default_page()
		}

		to_default_page() {
			this.$.$mol_state_arg.value( 'nav', 'builder' )
		}

		@$mol_mem
		override edit_name( next?: string ): string {
			if( next === undefined ) {
				return this.program_name( this.current_program() )
			}

			return next
		}

		build_key( s: string ) {
			return `gymload_${ s }`
		}

		program_name( key: any, next?: string ): string {
			return this.$.$mol_state_local.value( this.build_key( `program_name_${ key }` ), next ) || this.default_program_name()
		}

		user_program_ids( next?: number[] ): readonly ( number )[] {
			return this.$.$mol_state_local.value( this.build_key( 'program_ids' ), next ) || []
		}

		program_ids( next?: number[] ): readonly ( number )[] {
			return [ defaultProgramId, ...this.user_program_ids( next ) ]
		}

		@$mol_mem
		new_program_id() {
			return Math.max( 1, 1 + Math.max( ... this.program_ids() ) )
		}

		override builder_storage_key() {
			return this.build_key( `builder_${ this.current_program() }` )
		}

		override delete_program() {
			const prefix = this.builder_storage_key()
			const keys = Object.keys( this.$.$mol_state_local.native() )
				.filter( key => key.startsWith( prefix ) )

			keys.forEach( key => {
				this.$.$mol_state_local.native().removeItem( key )
			} )

			this.program_ids( this.program_ids().filter( id => id !== this.current_program() ) )
			this.current_program( this.program_ids()[ 0 ] || defaultProgramId )
			this.to_default_page()
		}

		override cancel_delete_program() {
			this.to_default_page()
		}

		@$mol_mem
		override new_import_bid(): string {
			const raw = this.new_import_data().trim()
			if( !raw ) return ''

			try {
				const data = $mol_wire_sync( $tukanable_gymload_page_export ).decompress( raw )
				if( !data ) {
					return 'Invalid data'
				}

				return ''
			} catch( err ) {
				return `Invalid data: ${ err }`
			}
		}

		@$mol_mem
		override new_import_data( next?: string ): string {
			if( next === undefined ) {
				return this.$.$mol_state_arg.value( 'import' ) || ''
			}

			return next
		}
	}

	export class $tukanable_gymload_help extends $.$tukanable_gymload_help {
		@$mol_mem
		content() {
			const lang = this.$.$mol_locale.lang()
			return this.$.$mol_fetch.text( `tukanable/gymload/help.${ lang }.md` )
		}
	}
}
