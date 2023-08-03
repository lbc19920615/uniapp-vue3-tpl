<template>
	<view class="nav-box">
		<scroll-view scroll-y="true" @scroll="scroll" 
		class="scroll-view" bounces="true" show-scrollba="false"
			enhanced="true" scroll-anchoring="true">
			<view :class="styleType == 1 ? 'navF':'navG'"
				:style="styleType == 2 ? `grid-template-rows: repeat(${rows}, 1fr);` : ''">
				<slot></slot>
			</view>
		</scroll-view>
		<view class="scroll-box" v-show="lL/rows > rows && styleType == 2 || is_scroll">
			<view class="scroll" :style="'transform: translateY('+sX+')'"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "rt-scroll-y",
		props: {
			// 切换展示格式
			styleType: {
				type: Number,
				default: 2
			},
			// 定义有几行,当styleType为2时有效
			rows: {
				type: Number,
				default: 1
			},
			// 列表长度
			lL: {
				type: Number,
				default: 0
			},
			// 是否显示滚动条
			is_scroll:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				sX: 0, //等比偏移量
				c_W: 0, //最外围容器宽度
				s_b_W: 0, //自定义滚动条盒子宽度
				s_W: 0, //自定义滚动条移动盒子宽度
			};
		},
		methods: {
			scroll(e) {
				let {
					sX,
					s_b_W,
					s_W,
					c_W,
				} = this.$data
				let {
					// itemCount,
					styleType,
					rows,
					lL
				} = this.$props
				if (styleType == 1) {
					rows = 1
				}
				
		
				let nW = e.detail.scrollHeight // 得到scroll-view的总宽度
				let nwl = nW / (lL / rows) //得到单个item的高度
				let itemCount = c_W/nwl //得到显示的item数量
				let l = (lL - (itemCount * rows)) / rows //算出隐藏了多少item
				let nX = e.detail.scrollTop // 得到滑动的偏移量
				// console.log(itemCount, l, nX);
				let sW = s_b_W - s_W + 2 //总高度减去滑块的高度，得出剩下的高度，+2是为了去掉缝隙
				sX = sW / ((nwl * l) / nX) + 'rpx' // 最终得出等比偏移量
				// console.log('scroll', sX);
				this.sX = sX
			},
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			query.selectAll('.nav-box,.scroll-box,.scroll').boundingClientRect((data) => {
				// dome元素从外到内依次获取数据，所以写法按顺序来才不会混
				this.c_W = data[0].height
				this.s_b_W = data[1].height * 2
				this.s_W = data[2].height * 2
			}).exec();
		}
	}
</script>

<style scoped>

	.nav-box {
		position: relative;
	}	


	.navF {
		display: flex;
		flex-wrap: nowrap;
	}

	.scroll-box {
		width: 10rpx;
		height: 70rpx;
		background: #000000;
		border-radius: 5rpx;
		margin: 10rpx auto 20rpx;
		position: absolute;
    right: 0;
    top: 0;
	opacity: 0;
	}

	.scroll {
		width: 10rpx;
		height: 30rpx;
		background: #FF6464;
		border-radius: 5rpx;
	}

	.scroll-view {
		height: var(--rt-scroll-y-h, 100%);
	}
</style>
