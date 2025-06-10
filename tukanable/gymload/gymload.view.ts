namespace $.$$ {
	type State = 'program' | 'edit_program' | 'add_program' | 'delete_program'

	const defaultProgramName = 'Default'
	const defaultProgramId = 0

	export class $tukanable_gymload extends $.$tukanable_gymload {
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

		current_view( next?: State ): State {
			return this.$.$mol_state_arg.value( 'view', next ) as State || 'program'
		}

		override tools() {
			const items = [ ...super.tools() ]

			items.push( this.ListPrograms() )
			items.push( this.EditProgram() )
			items.push( this.AddProgram() )

			return items
		}

		override body() {
			switch( this.current_view() ) {
				case 'program':
					return [ this.Builder() ]
				case 'edit_program':
					return [ this.EditView() ]
				case 'add_program':
					return [ this.NewView() ]
				case 'delete_program':
					return [this.DeleteView()]
			}

			return super.body()
		}

		override new_name_bid(): string {
			return this.new_name().trim().length === 0 ? 'Required' : ''
		}

		override add_program() {
			const id = this.new_program_id()

			this.program_ids( [ ...this.program_ids(), id ] )
			this.program_name( id, this.new_name() )

			this.current_program( id )
			this.current_view( 'program' )
		}

		override edit_program() {
			this.program_name( this.current_program(), this.edit_name() )
			this.current_view( 'program' )
		}

		@$mol_mem
		override edit_name( next?: string ): string {
			return next || this.program_name( this.current_program() )
		}

		build_key( s: string ) {
			return `gymload_${ s }`
		}

		program_name( key: any, next?: string ): string {
			return this.$.$mol_state_local.value( this.build_key( `program_name_${ key }` ), next ) || defaultProgramName
		}

		program_ids( next?: number[] ): readonly ( number )[] {
			return this.$.$mol_state_local.value( this.build_key( 'program_ids' ), next ) || [ defaultProgramId ]
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
			})

			this.program_ids( this.program_ids().filter( id => id !== this.current_program() ) )
			this.current_program( this.program_ids()[0] || defaultProgramId)
			this.current_view( 'program' )
		}

		override cancel_delete_program() {
			this.current_view( 'program' )
		}
	}
}