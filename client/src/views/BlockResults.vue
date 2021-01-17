<template>
	<v-container fluid pa-0>
		<v-row align="center" justify="center">
			<v-col cols="12">
				<v-card elevation="6">
					<v-card>
						<v-card-title>
							Information for {{ $route.params.id }} block
						</v-card-title>
						<v-card-text>
							<v-row>
								<v-col
									cols="4"
									v-for="(
										value, name, index
									) in blockInformation"
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
								label="Show Only Contracts"
								@click="showOnlyContracts()"
							></v-switch>
						</v-card-title>
						<v-data-table
							:loading="loading"
							loading-text="Loading... Please wait"
							show-expand
							single-expand
							item-key="hash"
							:headers="headers"
							:items="blockResults"
							:search="search"
							sort-by="transactionIndex"
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
										<v-col cols="6">
											<v-tooltip top>
												<template
													v-slot:activator="{
														on,
														attrs,
													}"
												>
													<v-list-item
														three-line
														v-bind="attrs"
														v-on="on"
														:to="
															/transaction/ +
															item.hash
														"
													>
														<v-list-item-content>
															<v-list-item-title>
																Hash:
															</v-list-item-title>
															<div
																class="contract"
															>
																{{ item.hash }}
															</div>
														</v-list-item-content>
													</v-list-item>
												</template>
												<span>Go to transaction</span>
											</v-tooltip>
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
			blockInformation: [],
			allTransactions: [],
			search: '',
			headers: [
				{ text: 'transactionIndex', value: 'transactionIndex' },
				{ text: 'blockHash', value: 'blockHash' },
				// { text: 'blockNumber', value: 'blockNumber' },
				{ text: 'from', value: 'from' },
				{ text: 'to', value: 'to' },
				{ text: 'value', value: 'value' },

				{ text: 'gas', value: 'gas' },
				{ text: 'gasPrice', value: 'gasPrice' }
				// { text: 'hash', value: 'hash' },
				// { text: 'input', value: 'input' },
				// { text: 'nonce', value: 'nonce' },
				// { text: '1st 32 bytes', value: 'r' },
				// { text: 'Next 32 bytes', value: 's' },
				// { text: 'Recovery Value', value: 'v' },
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

				this.blockInformation = data.block;
				this.allTransactions = data.blockTransactions;
				this.blockResults = data.blockTransactions;
				delete this.blockInformation.transactions;

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
					(transaction) => transaction.isContract === 1
				);
			} else {
				this.blockResults = this.allTransactions;
			}
		}
	},

	mounted() {
		this.getBlockResults();
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
