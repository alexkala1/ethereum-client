<template>
	<v-container fill-height>
		<v-row align="center" justify="center">
			<v-col cols="10">
				<h1 class="pa-5 text-center">
					Welcome to ethereum contract scanner
				</h1>
			</v-col>
		</v-row>
		<v-row align="center" justify="center">
			<v-col cols="10">
				<h1 class="text-center display-1 font-weight-light">
					Search for transactions in a block
				</h1>
				<v-text-field
					outlined
					v-model="search"
					append-icon="mdi-magnify"
					label="Search a block hash"
					single-line
					hide-details
					@keyup.enter="$router.push(`/block/` + search)"
				></v-text-field>
				<div class="pa-2 text-center">
					<v-btn
						rounded
						color="primary"
						@click="$router.push(`/block/` + search)"
						>Search block</v-btn
					>
				</div>
			</v-col>
		</v-row>
		<v-row align="center" justify="center" class="py-5">
			<v-col cols="10">
				<v-card color="">
					<v-card-title
						class="justify-center display-1 font-weight-light"
					>
						Or define a number of blocks you want to search
					</v-card-title>
					<v-card-text>
						<h2 class="text-center py-5">
							Current number of blocks is {{ blockCount }}
						</h2>
						<v-row>
							<v-col cols="6">
								<v-card height="100%" class="card-outter">
									<v-card-title>
										You can either select a number from the
										latest block
										<br />
										*Please put only positive number
									</v-card-title>
									<v-card-text>
										<v-text-field
											v-model="blockGap"
											outlined
											type="number"
											label="Difference in blocks"
										></v-text-field>
									</v-card-text>
									<v-card-actions class="card-actions">
										<v-btn
											color="primary"
											text
											:to="
												'/block/difference/' + blockGap
											"
											>Search now</v-btn
										>
									</v-card-actions>
								</v-card>
							</v-col>
							<v-col cols="6">
								<v-card height="100%">
									<v-card-title>
										Or set a specific block count by putting
										in the "from" - "to" section the
										specific block range you want. (from =
										earliest block, to = latest block)
									</v-card-title>
									<v-card-text>
										<v-text-field
											label="from"
											v-model="blockFrom"
											outlined
										></v-text-field>
										<v-text-field
											label="to"
											v-model="blockTo"
											outlined
										></v-text-field>
									</v-card-text>
									<v-card-actions>
										<v-btn
											:to="
												'/block/distance/' +
												blockFrom +
												'/' +
												blockTo
											"
											color="primary"
											text
											>Search now</v-btn
										>
									</v-card-actions>
								</v-card>
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
			search: '',
			blockCount: '',
			blockFrom: '',
			blockTo: '',
			blockGap: ''
		};
	},

	methods: {
		async getBlockCount() {
			const { data } = await axios.get(
				'http://ethclient.drosatos.eu:3001/api/v1/eth/blockCount'
			);

			this.blockCount = data;
		}
	},

	mounted() {
		this.getBlockCount();
	}
};
</script>

<style scoped>
.card-outter {
	position: relative;
	padding-bottom: 50px;
}
.card-actions {
	position: absolute;
	bottom: 0;
}
</style>
