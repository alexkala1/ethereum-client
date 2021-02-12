<template>
	<v-container fill-height fluid class="pa-0">
		<v-row align="center" justify="center" no-gutters class="pa-0">
			<v-col cols="12" class="pa-0">
				<v-parallax dark src="../assets/ethereum.jpg" height="700">
					<v-row align="center" justify="start">
						<v-col cols="12" md="6">
							<h1
								class="display-2 text-center font-weight-thin mb-4"
							>
								Welcome to ethereum contract scanner
							</h1>
							<h4 class="headline text-center my-4 pt-5">
								This is an application where you can search for
								transactions through blocks and examine patterns
								or smart contracts
							</h4>
							<div class="pa-5">
								<v-text-field
									outlined
									v-model="search"
									append-icon="mdi-magnify"
									label="Search a block number"
									single-line
									hide-details
									@keyup.enter="
										$router.push(`/block/` + search)
									"
								></v-text-field>
								<div class="pa-2 d-flex justify-center">
									<v-btn
										rounded
										color="primary"
										@click="
											$router.push(`/block/` + search)
										"
										>Search block</v-btn
									>
								</div>
							</div>
						</v-col>
					</v-row>
				</v-parallax>
			</v-col>
		</v-row>
		<v-row align="center" justify="center">
			<v-col cols="12">
				<v-card>
					<v-card-title
						class="justify-center display-1 font-weight-light"
						style="word-break: normal"
					>
						You can also define a number of blocks you want to
						search
					</v-card-title>
					<v-card-text>
						<h2 class="text-center py-5">
							Current number of blocks is {{ blockCount }}
						</h2>
						<v-row justify="center">
							<v-col cols="12" md="6">
								<v-tabs v-model="tab" align-with-title centered>
									<v-tab> Difference from latest </v-tab>
									<v-tab> Difference between blocks </v-tab>
								</v-tabs>
								<v-tabs-items v-model="tab">
									<v-tab-item>
										<v-card
											height="100%"
										>
											<v-card-title
												style="word-break: break-word"
											>
												You can select a number
												from the latest block
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
											<v-card-actions>
												<v-btn
													text
													:to="
														'/block/difference/' +
														blockGap
													"
													>Search now</v-btn
												>
											</v-card-actions>
										</v-card>
									</v-tab-item>
									<v-tab-item>
										<v-card height="100%">
											<v-card-title
												style="word-break: break-word"
											>
												Set a specific block count by
												putting in the "from - to"
												section the specific block range
												you want. (from = latest
												block, to = earliest block)
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
													text
													>Search now</v-btn
												>
											</v-card-actions>
										</v-card>
									</v-tab-item>
								</v-tabs-items>
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
			tab: null,

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
				`${process.env.VUE_APP_HOST}/api/v1/eth/blockCount`
			);

			this.blockCount = data;
		}
	},

	mounted() {
		this.getBlockCount();
	}
};
</script>

<style>
.v-parallax__content {
	background: linear-gradient(45deg, black, transparent) !important;
}

.v-slide-group__prev.v-slide-group__prev--disabled {
	display: none !important;
}
</style>
