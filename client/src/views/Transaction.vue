<template>
	<v-container>
		<v-row>
			<v-col cols="12">
				<v-card>
					<v-card-title>
						Transaction for hash {{ $route.params.id }}
					</v-card-title>
					<v-card-text>
						<v-row>
							<v-col
								cols="4"
								v-for="(value, name, index) in transaction"
								:key="index"
							>
								<v-list-item two-line>
									<v-list-item-content>
										<v-list-item-title>
											{{ name }}
										</v-list-item-title>
										<v-list-item-subtitle>
											{{ value }}
										</v-list-item-subtitle>
									</v-list-item-content>
								</v-list-item>
							</v-col>
						</v-row>
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
			transaction: []
		};
	},

	methods: {
		async getTransaction() {
			try {
				const { data } = await axios.get(
					`http://localhost:3001/api/v1/eth/transaction/${this.$route.params.id}`
				);

				this.transaction = data;
			} catch (error) {
				console.log(error);
			}
		}
	},

	mounted() {
		this.getTransaction();
	}
};
</script>

<style>
.v-list-item__title, .v-list-item__subtitle {
	white-space: normal !important;
}
</style>
