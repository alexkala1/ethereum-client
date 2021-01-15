<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <router-view></router-view>
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
		Footer,
	},

	data: () => ({
		//
	}),
};
</script>
