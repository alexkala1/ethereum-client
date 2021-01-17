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
				<v-card>
					<v-card-title>
						Information for the last
						{{ $route.params.diff }} blocks.
						<v-text-field
							class="px-2"
							v-model="search"
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
				<v-card>
					<v-card-text>
						<v-card-title>
							Transactions in the last
							{{ $route.params.diff }} blocks.
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
							:headers="transactionHeaders"
							:items="transactions"
							:search="transactionSearch"
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
				{ text: 'transactions', value: 'transactions' },
				{ text: 'transactionsRoot', value: 'transactionsRoot' },
				{ text: 'uncles', value: 'uncles' }
			],
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
				this.allTransactions = data.blockTransactions;

				console.log(data.blockTransactions, data.blocks);

				this.loading = false;
			} catch (error) {
				console.log(error);

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
