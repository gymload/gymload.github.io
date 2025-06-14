namespace $.$$ {
	type NewItem = {
		value: number
	}

	const empty_item: NewItem = {
		value: 0,
	}

	export class $tukanable_gymload_builder_weights extends $.$tukanable_gymload_builder_weights {
		build_key( s: string ) {
			return this.state_key( `gymload_builder_v1_weights_${ this.storage_key() }_${ s }` )
		}

		data_ids( next?: number[] ): number[] {
			return this.$.$mol_state_local.value( this.build_key( 'ids' ), next ) || []
		}

		enabled( next?: boolean ): boolean {
			return this.$.$mol_state_local.value( this.build_key( 'opened' ), next ) ?? super.enabled()
		}

		@$mol_mem
		override values() {
			const res = this.data_ids().map( id => this.row_value( id ) )
			res.sort( ( a, b ) => a - b )
			return res
		}

		row( id: any, next?: NewItem | null ): NewItem {
			const key = this.build_key( `item_${ id }` )
			if( next === undefined ) {
				return this.$.$mol_state_local.value<NewItem>( key ) || empty_item
			}

			this.$.$mol_state_local.value<NewItem>( key, next )

			return next || empty_item
		}

		override row_title( id: any ): string {
			const idx = this.data_ids().indexOf( id )

			return `Weight #${ idx + 1 }`
		}

		override row_value( id: any, next?: number ) {
			return this.row( id, next ? { value: next } : undefined ).value
		}

		override row_remove( id: any ) {
			this.data_ids( this.data_ids().filter( item => item !== id ) )
			this.row( id, null )
		}

		@$mol_mem
		new_id() {
			return Math.max( 1, 1 + Math.max( ... this.data_ids() ) )
		}

		override add() {
			const new_id = this.new_id()
			const new_item = { ...empty_item }

			const ids = this.data_ids()
			if( ids.length > 1 ) {
				const last_item = this.row( ids[ ids.length - 1 ] )
				const last_item2 = this.row( ids[ ids.length - 2 ] )

				new_item.value = last_item.value + ( last_item.value - last_item2.value )
			}

			this.data_ids( [ ...ids, new_id ] )
			this.row( new_id, new_item )
		}

		items() {
			if (!this.enabled()) {
				return []
			}

			return [
				...this.data_ids().map( id => this.Item( id ) ),
				this.AddButton(),
			]
		}
	}
}