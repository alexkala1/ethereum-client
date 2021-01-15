<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="10">
				<h1 class="text-center">
					Welcome to ethereum contract scanner
				</h1>
				<v-text-field
					outlined
					v-model="search"
					append-icon="mdi-magnify"
					label="Search a block hash"
					single-line
					hide-details
					@keyup.enter="$router.push(`/block/` + search)"
				></v-text-field>
				<div class="pa-2 text-center">
					<v-btn rounded color="primary" @click="$router.push(`/block/` + search)"
						>Search block</v-btn
					>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			search: ''
		};
	},

	name: 'Home'
};
</script>
