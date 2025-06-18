namespace $.$$ {
	const { rem } = $mol_style_unit

	const currentWidth = rem( 19 )

	$mol_style_define( $tukanable_gymload_builder_day_results_set, {
		paddingTop: rem(0.25),
		paddingBottom: rem(0.25),

		PastWeekView: {
			padding: $mol_gap.text,
			alignSelf: 'end',
		},
		FutureWeekView: {
			padding: $mol_gap.text,
			alignSelf: 'end',
		},
		PlanLabel: {
			flex: {
				grow: 1,
			},
		},
		DoneWeekView: {
			paddingLeft: rem(1),
			paddingRight: rem(1),
			alignItems: 'center',
			width: currentWidth,
		},
		CurrentWeekView: {
			width: currentWidth,
		},
		DoneButton: {
			marginLeft: rem( 1 ),
		},
		SetIndex: {
			alignSelf: 'end',
			padding: $mol_gap.text,
		},
	} )
}
