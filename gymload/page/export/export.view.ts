namespace $.$$ {
	export class $tukanable_gymload_page_export extends $.$tukanable_gymload_page_export {
		override raw_data(): string {
			const prefix = this.storage_key()
			return $tukanable_gymload_page_export.extract( this.storage_key() )
		}

		static extract( prefix: string ) {
			const result: any = {}

			Object.keys( this.$.$mol_state_local.native() )
				.forEach( key => {
					if( !key.startsWith( prefix ) ) {
						return
					}

					const short_key = key.slice( prefix.length )

					result[ short_key ] = this.$.$mol_state_local.value( key )
				} )

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

		override event() {
			return {
				...super.event(),
				click: ( e: Event ) => this.Copy().click( e ),
			}
		}

		override empty_syntax() {
			return new $mol_syntax2( {
				'any': /\?/,
			} )
		}
	}
}
