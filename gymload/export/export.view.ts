namespace $.$$ {
	export class $tukanable_gymload_export extends $.$tukanable_gymload_export {
		override raw_data(): string {
			const prefix = this.storage_key()
			const result: any = {}
			console.log(prefix)

			Object.keys( this.$.$mol_state_local.native() )
				.forEach( key => {
					if( !key.startsWith( prefix ) ) {
						return
					}

					const short_key = key.slice( prefix.length )

					result[ short_key ] = this.$.$mol_state_local.native().getItem( key )
				} )

			return $mol_wire_sync( this ).compress( result )
		}

		async compress( data: any ) {
			const json = JSON.stringify( data, null, '  ' )

			const cs = new CompressionStream( "gzip" )
			const writer = cs.writable.getWriter()
			writer.write( new TextEncoder().encode( json ) )
			writer.close()

			const compressed = await new Response( cs.readable ).arrayBuffer()
			const raw = new Uint8Array( compressed )

			const res = $mol_base64_encode_web(raw)
			console.log('size', json.length, raw.length, raw.length / json.length * 100)

			return res
		}

		override copy(  ) {
			const cb = $mol_wire_sync( this.$.$mol_dom_context.navigator.clipboard )
			
			cb.writeText?.( this.raw_data() )
		}
	}
}
