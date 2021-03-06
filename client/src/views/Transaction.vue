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
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-list-item
											two-line
											v-on="on"
											v-bind="attrs"
										>
											<v-list-item-content>
												<v-list-item-title>
													{{
														transactionHeaders[
															index
														]
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
					<v-divider
						class="my-5"
						v-if="transaction.isContract"
					></v-divider>

					<v-card v-if="transaction.isContract" flat>
						<v-card-title
							class="display-2 font-weight-light justify-center"
						>
							Decompilation Data
						</v-card-title>
						<v-card-text class="py-5">
							<v-row justify="center">
								<v-col cols="6">
									<h1 class="text-center py-3">Events</h1>
									{{ contractEvents }}
								</v-col>
								<v-col cols="6">
									<h1 class="text-center py-3">Functions</h1>
									{{ contractFunctions }}
								</v-col>
								<v-col cols="12">
									<h1 class="text-center py-3">
										Full Solidity Code
									</h1>
									<v-textarea
										:value="decompiledContract"
										rows="20"
										@click="
											copyToClipboard(decompiledContract)
										"
									>
									</v-textarea>
								</v-col>
							</v-row>
						</v-card-text>
					</v-card>
					<v-divider
						class="my-5"
						v-if="transaction.isContract"
					></v-divider>
					<v-card v-if="hasError">
						<v-card-title class="justify-center">
							There was an error
						</v-card-title>
						<v-card-text>
							{{ error }}
						</v-card-text>
					</v-card>

					<v-card flat v-if="transaction.isContract">
						<v-card-title
							class="text-center justify-center display-2 font-weight-light"
						>
							Contract binary
							<v-tooltip top>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										v-on="on"
										v-bind="attrs"
										plain
										icon
										@click="copyToClipboard(contractBinary)"
									>
										<v-icon>mdi-content-copy</v-icon>
									</v-btn>
								</template>
								<span>Copy Binary Code</span>
							</v-tooltip>
						</v-card-title>
						<v-card-text>
							{{ contractBinary }}
						</v-card-text>
					</v-card>
				</v-card>

				<div v-else class="text-center display-3">
					Something went wrong.Try refreshing and if nothing happens
					please contact admin.
				</div>
			</v-col>
		</v-row>
		<v-snackbar
			v-model="snackbar"
			:color="color"
			top
			right
			multi-line
			timeout="2000"
		>
			{{ text }}
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
			color: '',
			text: '',
			contractBinary: '',
			hasContract: '',
			contractEvents: '',
			contractFunctions: '',
			decompiledContract: '',
			hasError: false,
			error: '',
			transactionHeaders: [
				'Block Hash',
				'Block Number',
				'From',
				'Gas',
				'Gas Price',
				'Hash',
				'Input',
				'Nonce',
				'First 32 bytes of the signature',
				'Next 32 bytes of the signature',
				'To',
				'Transaction Index',
				'Recovery value + 27',
				'Value',
				'Is Contract'
			],
			tooltips: [
				'Hash of the block where this transaction was in. ',
				'Block number where this transaction was in.',
				'Address of the sender.',
				'Gas provided by the sender.',
				'Gas price provided by the sender in wei.',
				'Hash of the transaction.',
				'The data sent along with the transaction.',
				'The number of transactions made by the sender prior to this one.',
				'First part of the ECDSA signature. This is used to recover the public key.',
				'Second part of the ECDSA signature. This is used to recover the public key.',
				'Address of the receiver.',
				'Integer of the transactions index position in the block.',
				'Additional bit for ECDSA signature. This is used to recover the public key.',
				'Value transferred in wei.',
				'Determines if transaction is a contract.'
			]
		};
	},

	methods: {
		async getTransaction() {
			try {
				const { data } = await axios.get(
					`${process.env.VUE_APP_HOST}/api/v1/eth/transaction/${this.$route.params.id}`
				);

				this.transaction = data.transaction;
				this.contractBinary = data.code;

				const response = await axios.get(
					`${process.env.VUE_APP_HOST}/api/v1/eth/transaction/${data.transaction.to}/decompile`
				);

				if (response.status === 200) {
					this.hasContract = true;
					this.contractEvents = response.data.events;
					this.contractFunctions = response.data.functions;
					this.decompiledContract = response.data.decompiled;
				}

				this.loading = false;
			} catch (error) {
				this.snackbar = true;
				this.loading = false;
				this.color = 'error';
				this.text = error;
			}
		},

		copyToClipboard(text) {
			const dummy = document.createElement('textarea');
			document.body.appendChild(dummy);
			dummy.value = text;
			dummy.select();
			document.execCommand('copy');
			document.body.removeChild(dummy);

			this.snackbar = true;
			this.color = 'green';
			this.text = 'Copied to clipboard';
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
