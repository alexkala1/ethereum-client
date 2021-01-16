<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12">
				<v-card>
					<v-card-title>
						Transactions for block {{ $route.params.id }}
						<v-text-field
							class="px-2"
							v-model="search"
							append-icon="mdi-magnify"
							label="Search"
							single-line
						></v-text-field>
						<v-spacer></v-spacer>
						<v-switch
							v-model="contractSwitch"
							:label="contractSwitch ? 'Show all transactions' : 'Show only contracts'"
							@click="showOnlyContracts()"
						></v-switch>
					</v-card-title>
					<v-data-table
						:loading="loading"
						loading-text="Loading... Please wait"
						show-expand
						single-expand
						item-key="hash"
						@click:row="
							$router.push('/transaction/' + $route.params.id)
						"
						:headers="headers"
						:items="blockResults"
						:search="search"
					>
						<template v-slot:expanded-item="{ headers, item }">
							<td :colspan="headers.length">
								<v-row>
									<v-col cols="6">
										<v-list-item three-line>
											<v-list-item-content>
												<v-list-item-title>
													Input:
												</v-list-item-title>
												<div class="contract">
													{{ item.input }}
												</div>
											</v-list-item-content>
										</v-list-item>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="3">
										<v-list-item three-line>
											<v-list-item-content>
												<v-list-item-title>
													1st 32 bytes:
												</v-list-item-title>
												<v-list-item-subtitle>
													{{ item.r }}
												</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-col>
									<v-col cols="3">
										<v-list-item three-line>
											<v-list-item-content>
												<v-list-item-title>
													Next 32 bytes:
												</v-list-item-title>
												<v-list-item-subtitle>
													{{ item.s }}
												</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="3">
										<v-list-item three-line>
											<v-list-item-content>
												<v-list-item-title>
													Recovery Value:
												</v-list-item-title>
												<v-list-item-subtitle>
													{{ item.v }}
												</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-col>
									<v-col cols="3">
										<v-list-item three-line>
											<v-list-item-content>
												<v-list-item-title>
													Nonce:
												</v-list-item-title>
												<v-list-item-subtitle>
													{{ item.nonce }}
												</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-col>
								</v-row>
							</td>
						</template>
					</v-data-table>
				</v-card>
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
	name: 'Block Results',

	data() {
		return {
			loading: true,
			blockResults: [],
			allTransactions: [],
			search: '',
			headers: [
				{ text: 'blockHash', value: 'blockHash' },
				// { text: 'blockNumber', value: 'blockNumber' },
				{ text: 'from', value: 'from' },
				{ text: 'to', value: 'to' },
				{ text: 'gas', value: 'gas' },
				{ text: 'gasPrice', value: 'gasPrice' },
				{ text: 'hash', value: 'hash' },
				// { text: 'input', value: 'input' },
				// { text: 'nonce', value: 'nonce' },
				// { text: '1st 32 bytes', value: 'r' },
				// { text: 'Next 32 bytes', value: 's' },
				{ text: 'transactionIndex', value: 'transactionIndex' },
				// { text: 'Recovery Value', value: 'v' },
				{ text: 'value', value: 'value' }
			],
			snackbar: false,
			snackbarError: '',
			contractSwitch: false
		};
	},

	methods: {
		async getBlockResults() {
			try {
				const { data } = await axios.get(
					`http://localhost:3001/api/v1/eth/block/${this.$route.params.id}`
				);
				this.allTransactions = data;
				this.blockResults = data;
				this.loading = false;
			} catch (error) {
				this.snackbar = true;
				this.loading = false;
				this.snackbarError = error;
			}
		},

		showOnlyContracts() {
			if (this.contractSwitch === true) {
				this.blockResults = this.allTransactions.filter(
					(transaction) => transaction.input !== '0x'
				);
			} else {
				this.blockResults = this.allTransactions;
			}
		}
	},

	created() {
		this.getBlockResults();
	},

	mounted() {
		this.showOnlyContracts();
	}
};
</script>
 <style>
.contract {
	word-break: break-word;
	color: rgba(0, 0, 0, 0.6);
	line-height: 1.5 !important;
}
</style>
