namespace $.$$ {
	export class $tukanable_gymload_page_export extends $.$tukanable_gymload_page_export {
		@$mol_mem
		override raw_data(): string {
			const prefix = this.storage_key()
			const only_settings = this.only_settings()

			return $tukanable_gymload_page_export.extract( prefix, only_settings )
		}

		override data_url(): string {
			return this.$.$mol_state_arg.link( {
				nav: 'newprogram',
				import: this.raw_data(),
			} )
		}

		override url_block(): $mol_view | null {
			if( this.raw_data().length < 2000 ) {
				return this.UrlBlock()
			}

			return null
		}

		override only_settings( next?: boolean ): boolean {
			let next_val: string | undefined
			if( next !== undefined ) {
				next_val = next ? '1' : '0'
			}

			return this.$.$mol_state_arg.value( 'only_settings', next_val ) !== '0'
		}

		static extract( prefix: string, only_settings: boolean ) {
			const result: any = {}

			Object.keys( this.$.$mol_state_local.native() )
				.forEach( key => {
					if( !key.startsWith( prefix ) ) {
						return
					}

					// fix it if you can
					// tukanable/gymload/builder/day/results/set/set.view.ts#89
					if( only_settings && key.match( /\d+_\d+_\d+_\d+_(reps|weight)$/ ) ) {
						return
					}

					const short_key = key.slice( prefix.length )

					result[ short_key ] = this.$.$mol_state_local.value( key )
				} )

			if( this.$.$mol_state_arg.value( 'json' ) ) {
				return JSON.stringify( result, null, '  ' )
			}

			return $mol_wire_sync( $tukanable_gymload_page_export ).compress( result )
		}

		static inject( prefix: string, raw: string ) {
			const data = $mol_wire_sync( $tukanable_gymload_page_export ).decompress( raw )

			Object.keys( data )
				.forEach( key => {
					this.$.$mol_state_local.value( prefix + key, data[ key ] )
				} )

			return data
		}

		static async compress( data: any ) {
			const json = JSON.stringify( data, null, '  ' )

			const cs = new CompressionStream( "gzip" )
			const writer = cs.writable.getWriter()
			writer.write( new TextEncoder().encode( json ) )
			writer.close()

			const compressed = await new Response( cs.readable ).arrayBuffer()
			const raw = new Uint8Array( compressed )

			return $mol_base64_encode( raw )
		}

		static async decompress( raw: string ) {
			const bin = $mol_base64_decode( raw )

			const ds = new DecompressionStream( "gzip" )
			const writer = ds.writable.getWriter()
			writer.write( bin )
			writer.close()

			const json = await new Response( ds.readable ).text()
			return JSON.parse( json )
		}

		override empty_syntax() {
			return new $mol_syntax2( {
				'any': /\?/,
			} )
		}
	}

	export class $tukanable_gymload_page_export_textarea extends $.$tukanable_gymload_page_export_textarea {
		override event() {
			return {
				...super.event(),
				click: ( e: Event ) => {
					const b = this.copyButton()
					if( b ) {
						b.click( e )
					}
				}
			}
		}
	}
}
