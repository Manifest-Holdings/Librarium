import { Global } from '@emotion/react'

const Fonts = () => (
  <Global
    styles={`
			@font-face {
				font-family: 'Sweet Sans Pro';
				src: url('/fonts/SweetSansPro/SweetSansPro-Medium.woff2') format('woff2'),
						url('/fonts/SweetSansPro/SweetSansPro-Medium.woff') format('woff');
				font-weight: 500;
				font-style: normal;
				font-display: swap;
			}

			@font-face {
				src: url('/fonts/Roslindale/Roslindale-TextRegular.woff2') format("woff2"),
					url('/fonts/Roslindale/Roslindale-TextRegular.woff') format("woff");
				font-family: 'Roslindale';
				font-style: normal;
				font-weight: normal;
				font-display: swap;
			}

			@font-face {
				src: url('/fonts/Roslindale/Roslindale-DisplayLight.woff2') format("woff2"),
						url('/fonts/Roslindale/Roslindale-DisplayLight.woff') format("woff");
				font-family: 'Roslindale';
				font-style: normal;
				font-weight: 300;
				font-display: swap;
			}

			@font-face {
				src: url('/fonts/Roslindale/Roslindale-DisplayCondensedBold.woff2') format("woff2"),
					url('/fonts/Roslindale/Roslindale-DisplayCondensedBold.woff') format("woff");
				font-family: 'Roslindale Display Condensed';
				font-style: normal;
				font-weight: bold;
				font-display: swap;
			}

			@font-face {
				src: url('/fonts/Roslindale/Roslindale-TextBold.woff2') format("woff2"),
						url('/fonts/Roslindale/Roslindale-TextBold.woff') format("woff");
				font-family: 'Roslindale';
				font-style: normal;
				font-weight: 700;
				font-display: swap;
			}
    `}
  />
)

export default Fonts
