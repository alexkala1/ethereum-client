<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12" v-if="loading">
				<v-card flat>
					<v-card-title
						class="justify-center font-weight-light display-1"
					>
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
				<v-card class="pa-5" flat>
					<v-card-title>
						Information for blocks from {{ $route.params.from }} to
						{{ $route.params.from }}.
						<v-text-field
							class="px-2"
							v-model="blockSearch"
							append-icon="mdi-magnify"
							label="Search"
							single-line
						></v-text-field>
						<v-spacer></v-spacer>
					</v-card-title>
					<v-data-table
						:loading="loading"
						loading-text="Loading... Please wait"
						show-expand
						single-expand
						item-key="hash"
						:headers="blockHeaders"
						:items="blocks"
						:search="blockSearch"
						sort-by="number"
					>
					</v-data-table>
				</v-card>
				<div class="text-center py-5">
					<v-btn
						@click="$vuetify.goTo('.transactions', 500, 300)"
						rounded
						light
						>Check transactions</v-btn
					>
				</div>

				<v-card class="pa-5 transactions" flat>
					<v-card-text>
						<v-card-title>
							Transactions for blocks from
							{{ $route.params.from }} to
							{{ $route.params.from }}.
							<v-text-field
								class="px-2"
								v-model="transactionsSearch"
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
							:headers="transactionHeaders"
							:items="transactions"
							:search="transactionsSearch"
							sort-by="blockNumber"
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
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
		<v-snackbar
			v-model="snackbar"
			vertical
			timeout="2000"
			:color="snackbarColor"
		>
			{{ snackbarMessage }}

			<template v-slot:action="{ attrs }">
				<v-btn
					text
					v-bind="attrs"
					@click="snackbar = false"
				>
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
			blocks: [],
			transactions: [],
			allTransactions: [],
			contractSwitch: false,
			transactionHeaders: [
				{ text: 'transactionIndex', value: 'transactionIndex' },
				{ text: 'blockHash', value: 'blockHash' },
				{ text: 'blockNumber', value: 'blockNumber' },
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
			blockHeaders: [
				{ text: 'difficulty', value: 'difficulty' },
				{ text: 'extraData', value: 'extraData' },
				{ text: 'gasLimit', value: 'gasLimit' },
				{ text: 'gasUsed', value: 'gasUsed' },
				{ text: 'hash', value: 'hash' },
				{ text: 'logsBloom', value: 'logsBloom' },
				{ text: 'miner', value: 'miner' },
				{ text: 'mixHash', value: 'mixHash' },
				{ text: 'nonce', value: 'nonce' },
				{ text: 'number', value: 'number' },
				{ text: 'parentHash', value: 'parentHash' },
				{ text: 'receiptsRoot', value: 'receiptsRoot' },
				{ text: 'sha3Uncles', value: 'sha3Uncles' },
				{ text: 'size', value: 'size' },
				{ text: 'stateRoot', value: 'stateRoot' },
				{ text: 'timestamp', value: 'timestamp' },
				{ text: 'totalDifficulty', value: 'totalDifficulty' },
				{ text: 'transactionsRoot', value: 'transactionsRoot' },
				{ text: 'uncles', value: 'uncles' }
			],
			loading: true,
			blocksSearch: '',
			transactionsSearch: '',
			snackbar: false,
			snackbarColor: '',
			snackbarMessage: ''
		};
	},

	methods: {
		async fetchBlockDifference() {
			try {
				const response = await axios.get(
					`http://ethclient.drosatos.eu:3001/api/v1/eth/block/distance/${this.$route.params.from}/${this.$route.params.to}`
				);
				this.blocks = response.data.blocks;
				this.transactions = response.data.transactions;
				this.allTransactions = response.data.transactions;

				this.loading = false;
				if (response.data.blocks.length === 0) {
					this.snackbar = true;
					this.snackbarColor = 'error';
					this.snackbarMessage = 'Invalid Data input';
					this.loading = false;
				}
			} catch (error) {
				this.snackbar = true;
				this.snackbarColor = 'error';
				this.snackbarMessage = error;

				this.loading = false;
			}
		},

		showOnlyContracts() {
			if (this.contractSwitch === true) {
				this.transactions = this.allTransactions.filter(
					(transaction) => transaction.isContract === 1
				);
			} else {
				this.transactions = this.allTransactions;
			}
		}
	},

	mounted() {
		this.fetchBlockDifference();
	}
};
</script>

<style>
</style>
