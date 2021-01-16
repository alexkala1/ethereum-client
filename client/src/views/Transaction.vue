<template>
	<v-container>
		<v-row>
			<v-col cols="12">
				<v-dialog v-model="loading" persistent width="434">
					<v-card color="primary" class="pa-5 text-center">
						<v-card-title class="white--text justify-center">
							Loading: Please Wait...
						</v-card-title>
						<v-row align="center" justify="center">
							<v-col cols="12" class="text-center">
								<v-progress-circular
									color="white"
									width="7"
									size="70"
									indeterminate
								></v-progress-circular>
							</v-col>
						</v-row>
					</v-card>
				</v-dialog>
				<v-card v-if="transaction.length !== 0">
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
				<div v-else class="text-center display-3">
					Something went wrong.Try refreshing and if nothing happens please contact admin.
				</div>
			</v-col>
		</v-row>
		<v-snackbar
			v-model="snackbar"
			color="error"
			top
			right
			multi-line
			timeout="2000"
		>
			{{ snackbarError }}
			<template v-slot:action="{ attrs }">
				<v-btn text v-bind="attrs" @click="snackbar = false">
					Close
				</v-btn>
			</template>
		</v-snackbar>
	</v-container>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			transaction: [],
			loading: true,
			snackbar: false,
			snackbarError: ''
		};
	},

	methods: {
		async getTransaction() {
			try {
				const { data } = await axios.get(
					`http://localhost:3001/api/v1/eth/transaction/${this.$route.params.id}`
				);

				this.transaction = data;
				this.loading = false;
			} catch (error) {
				this.snackbar = true;
				this.loading = false;
				this.snackbarError = error;
			}
		}
	},

	mounted() {
		this.getTransaction();
	}
};
</script>

<style>
.v-list-item__title,
.v-list-item__subtitle {
	white-space: normal !important;
}
</style>
