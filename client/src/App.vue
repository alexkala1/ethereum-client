<template>
	<v-app>
		<v-main>
			<v-container fluid fill-height>
				<v-row justify="center">
					<v-col cols="12">
						<router-view></router-view>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
		<Footer />
	</v-app>
</template>

<script>
import Footer from './components/footer.vue';

export default {
	name: 'App',

	components: {
		Footer
	},

	data: () => ({
		//
	})
};
</script>
