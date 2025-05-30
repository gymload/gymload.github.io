namespace $.$$ {
	const {rem} = $mol_style_unit

	$mol_style_define( $gymload_builder_day, {
		flexDirection: 'column',
		Row: {
			flexDirection: 'column',
		},
		ChartWrapper: {
			maxHeight: '200px',
		},
		DayTitle: {
			minHeight: rem(2),
			margin: 0,
			padding: $mol_gap.text,
			gap: $mol_gap.text,
			wordBreak: 'normal',
			textShadow: '0 0',

			font: {
				size: 'inherit',
				weight: 'normal',
			},
	
			flex: {
				grow: 1,
				shrink: 1,
				basis: 'auto',
			},

		},
	})
}