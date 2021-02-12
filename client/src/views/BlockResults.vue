<template>
	<v-container>
		<v-row align="center" justify="center">
			<v-col cols="12">
				<v-card elevation="6">
					<v-card flat>
						<v-card-title>
							Information for {{ $route.params.id }} block
						</v-card-title>
						<v-card-text>
							<v-row>
								<v-col
									cols="12"
									md="4"
									v-for="(
										value, name, index
									) in blockInformation"
									:key="index"
								>
									<v-tooltip top>
										<template
											v-slot:activator="{ on, attrs }"
										>
											<v-list-item>
												<v-list-item-content
													two-line
													v-on="on"
													v-bind="attrs"
												>
													<v-list-item-title>
														{{
															blockHeaders[index]
														}}
													</v-list-item-title>
													<v-list-item-subtitle>
														{{ value }}
													</v-list-item-subtitle>
												</v-list-item-content>
											</v-list-item>
										</template>
										<span>{{ tooltips[index] }}</span>
									</v-tooltip>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
					<v-divider class="my-5"></v-divider>
					<v-card flat>
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
													<v-list-item-subtitle>
														{{ item.input }}
													</v-list-item-subtitle>
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
															<v-list-item-subtitle>
																{{ item.hash }}
															</v-list-item-subtitle>
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
				{ text: 'Transaction Index', value: 'transactionIndex' },
				{ text: 'From', value: 'from' },
				{ text: 'To', value: 'to' },
				{ text: 'Value', value: 'value' },
				{ text: 'Gas', value: 'gas' },
				{ text: 'Gas Price', value: 'gasPrice' }
			],
			snackbar: false,
			snackbarError: '',
			contractSwitch: false,
			blockHeaders: [
				'Difficulty',
				'Extra Data',
				'Gas Limit',
				'Gas Used',
				'Block Hash',
				'Logs Bloom',
				'Miner',
				'Mix Hash',
				'Nonce',
				'Block Number',
				'Parent Hash',
				'Receipts Root',
				'SHA3 Uncles',
				'Size',
				'State Root',
				'TimeStamp',
				'Total Difficulty',
				'Transactions Root',
				'Uncles'
			],
			tooltips: [
				'Integer of the difficulty for this block.',
				'The “extra data” field of this block',
				'The maximum gas allowed in this block.',
				'The total used gas by all transactions in this block.',
				'32 Bytes Hash of the block.',
				'256 Bytes The bloom filter for the logs of the block. ',
				'The address of the beneficiary to whom the mining rewards were given.',
				'hash which proves combined with the nonce that a sufficient amount of computation has been carried out on this block',
				'hash which proves combined with the mix-hash hat a sufficient amount of computation has been carried out on this block',
				'The block number.',
				'32 Bytes Hash of the parent block.',
				'the hash of the root of the state trie, whereas receiptRoot is the hash of the array of receipts for a given block.',
				'32 Bytes SHA3 of the uncles data in the block.',
				'Integer the size of this block in bytes.',
				'32 Bytes The root of the final state trie of the block.',
				'The unix timestamp for when the block was collated.',
				'Integer of the total difficulty of the chain until this block.',
				'32 Bytes The root of the transaction trie of the block.',
				'Array of uncle hashes.'
			]
		};
	},

	methods: {
		async getBlockResults() {
			try {
				const { data } = await axios.get(
					`${process.env.VUE_APP_HOST}/api/v1/eth/block/${this.$route.params.id}`
				);

				this.blockInformation = data.block;
				this.allTransactions = data.transactions;
				this.blockResults = data.transactions;

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
