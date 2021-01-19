<template>
	<v-footer dark padless app absolute class="d-print-none">
		<v-card flat tile class="primary white--text text-center" width="100%">

			<v-card-text class="white--text text-center">
				This web application is used for academic purposes. Its purpose
				is to draw data for research in why was a smart contract created
				and get an overview in what kind of transactions are in a block.
			</v-card-text>

			<v-divider></v-divider>

			<v-card-text class="white--text">
				{{ new Date().getFullYear() }} — <strong>Kalaitzidis Alexandros</strong>
			</v-card-text>
		</v-card>
	</v-footer>
</template>

<script>
export default {
	data: () => ({
		icons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram']
	})
};
</script>
