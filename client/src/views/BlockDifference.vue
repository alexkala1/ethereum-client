<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12" v-if="loading">
				<v-card flat color="#121212">
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
						Information for the last
						{{ $route.params.diff }} blocks.
						<v-text-field
							class="px-2"
							v-model="blocksSearch"
							append-icon="mdi-magnify"
							label="Search"
							single-line
						></v-text-field>
						<v-spacer></v-spacer>
					</v-card-title>
					<v-data-table
						:loading="loading"
						loading-text="Loading... Please wait"
						item-key="hash"
						:headers="blockHeaders"
						:items="blocks"
						:search="blocksSearch"
						sort-by="number"
					>
					</v-data-table>
				</v-card>
				<v-divider class="my-5"></v-divider>

				<v-card class="pa-5 transactions" flat>
					<v-card-text>
						<v-card-title>
							Transactions in the last
							{{ $route.params.diff }} blocks.
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
				{ text: 'Block Hash', value: 'blockHash' },
				{ text: 'Block Number', value: 'blockNumber' },
				{ text: 'Transaction Index', value: 'transactionIndex' },
				{ text: 'From', value: 'from' },
				{ text: 'To', value: 'to' },
				{ text: 'Value', value: 'value' },
				{ text: 'Gas', value: 'gas' },
				{ text: 'Gas Price', value: 'gasPrice' }
			],
			blockHeaders: [
				{ text: 'Difficulty', value: 'difficulty' },
				{ text: 'Extra Data', value: 'extraData' },
				{ text: 'Gas Limit', value: 'gasLimit' },
				{ text: 'Gas Used', value: 'gasUsed' },
				{ text: 'Hash', value: 'hash' },
				{ text: 'Logs Bloom', value: 'logsBloom' },
				{ text: 'Miner', value: 'miner' },
				{ text: 'Mix Hash', value: 'mixHash' },
				{ text: 'Nonce', value: 'nonce' },
				{ text: 'Number', value: 'number' },
				{ text: 'Parent Hash', value: 'parentHash' },
				{ text: 'Receipts Root', value: 'receiptsRoot' },
				{ text: 'SHA3 Uncles', value: 'sha3Uncles' },
				{ text: 'Size', value: 'size' },
				{ text: 'State Root', value: 'stateRoot' },
				{ text: 'Timestamp', value: 'timestamp' },
				{ text: 'Total Difficulty', value: 'totalDifficulty' },
				{ text: 'Transactions Root', value: 'transactionsRoot' },
				{ text: 'Uncles', value: 'uncles' }
			],
			loading: true,
			blocksSearch: '',
			transactionsSearch: ''
		};
	},

	methods: {
		async getBlockDifference() {
			try {
				const response = await axios.get(
					`${process.env.VUE_APP_HOST}/api/v1/eth/block/diff/${this.$route.params.diff}`
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
		this.getBlockDifference();
	}
};
</script>

<style>
</style>
