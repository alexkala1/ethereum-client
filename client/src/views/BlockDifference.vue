<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12" v-if="loading">
				<v-card flat>
					<v-card-title class="justify-center font-weight-light display-1">
						Loading. Please Wait...
					</v-card-title>
					<v-card-text class="d-flex justify-center">
						<v-progress-circular
							color="primary"
							width="7"
							size="70"
							indeterminate
						></v-progress-circular>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12" v-else>
				<v-card>
					<v-card-text>
						{{ blocks }}
					</v-card-text>
				</v-card>
				<v-card>
					<v-card-text>
						{{ transactions }}
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			blocks: [],
			transactions: [],
			loading: true,
			blocksSearch: '',
			transactionsSearch: ''
		};
	},

	methods: {
		async getBlockDifference() {
			try {
				const { data } = await axios.get(
					`http://localhost:3001/api/v1/eth/block/diff/${this.$route.params.diff}`
				);
				this.blocks = data.blocks;
				this.transactions = data.blockTransactions;
				this.loading = false;
			} catch (error) {
				console.log(error);
				this.loading = false;
			}
		}
	},

	mounted() {
		this.getBlockDifference();
	}
};
</script>

<style>
</style>
