import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		dark: false,
		themes: {
			dark: {
				primary: colors.orange.darken2,
				accent: colors.grey.darken3,
				secondary: colors.amber.darken3,
				info: colors.teal.lighten1,
				warning: colors.amber.base,
				error: colors.deepOrange.accent4,
				success: colors.green.accent3
			}
		}
	}

});
