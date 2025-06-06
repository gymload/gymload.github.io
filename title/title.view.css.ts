namespace $.$$ {
	const { rem } = $mol_style_unit

	const baseTitle = {
		minHeight: rem( 2 ),
		margin: 0,
		padding: $mol_gap.text,
		gap: $mol_gap.text,
		wordBreak: 'normal',
		textShadow: '0 0',

		font: {
			size: 'inherit',
			weight: 'normal',
		},
	} as const;

	$mol_style_define( $gymload_title, {
		Title: {
			...baseTitle,
			flex: {
				grow: 1,
			}
		},
		Extra: {
			...baseTitle,
		}
	} )
}