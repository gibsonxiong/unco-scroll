<template>
  <div class="item" @click="handleClick">
      <img
      v-if="lazyload"
      class="img"
      :data-src="item.img"
      alt
    />
    <img
      v-else
      class="img"
      :src="item.img"
      alt
    />
    <div class="content-wrap">
      <div>
        <div>
          <h2 class="title">{{item.name}}</h2>
          <div>
            <div>
              <div class="content">
                {{item.cateName}}
              </div>
            </div>
            <div class="price-wrap">
              <div class="price">￥{{item.price}}
              </div>
              <div class="sale">
                销量<span>30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        
      </div>
    </div>
  </div>
</template>

<script>
const data = [
  {
    img: require('../assets/logo1.png'),
    "name": "汉堡王（市民中心店）",
    "price": 33,
    "cateName": "西式快餐/汉堡"
  },
  {
    img: require('../assets/logo2.png'),
    "name": "尊宝比萨（市民中心店）",
    "price": 38,
    "cateName": "披萨"
  },
  {
    img: require('../assets/logo3.png'),
    "name": "虾胡闹·澳洲小龙虾（南山鲸鱼店）",
    "price": 138,
    "cateName": "小龙虾"
  },
  {
    img: require('../assets/logo4.png'),
    "name": "美颐美（市民中心店）",
    "price": 31,
    "cateName": "快餐简餐"
  },
  {
    img: require('../assets/logo5.png'),
    "name": "汉拿山石锅拌饭（市民中心店）",
    "price": 30,
    "cateName": "韩国菜"
  },
  {
    img: require('../assets/logo6.png'),
    "name": "张粿老•粿条工坊（市民中心店）",
    "price": 30,
    "cateName": "潮州菜"
  },
  {
    img: require('../assets/logo7.png'),
    "name": "永和大王（万佳店）",
    "price": 20,
    "cateName": "快餐简餐"
  },
  {
    img: require('../assets/logo1.png'),
    "name": "椰雨四季椰子鸡（龙华旗舰店）",
    "price": 60,
    "cateName": "特色火锅"
  },
  {
    img: require('../assets/logo2.png'),
    "name": "吉野家（凤凰大厦店）",
    "price": 25,
    "cateName": "日式快餐"
  },
  {
    img: require('../assets/logo3.png'),
    "name": "永和大王（景田店）",
    "price": 19,
    "cateName": "快餐简餐"
  },
  {
    img: require('../assets/logo4.png'),
    "name": "九龙冰室",
    "price": 35,
    "cateName": "茶餐厅"
  },
  {
    img: require('../assets/logo5.png'),
    "name": "嘉旺（海田店）",
    "price": 24,
    "cateName": "快餐简餐"
  },
  {
    img: require('../assets/logo6.png'),
    "name": "仟木烤肉（布吉店）",
    "price": 67,
    "cateName": "融合烤肉"
  },
  {
    img: require('../assets/logo7.png'),
    "name": "蓉一麦成都渣渣面（市民中心店）",
    "price": 29,
    "cateName": "面条"
  }
];
let index = 0;

export default {
  props:{
    lazyload: {
      type: Boolean,
      default: false
    }
  },
  data(){
    if(index > data.length - 1) index = 0;
    return {
      item: data[index++]
    }
  },
  methods:{
    handleClick(e){
      alert('click');
      this.$emit('click', e);
    }
  }
}
</script>

<style scoped lang="scss">
.item{
  padding:15px;
  display:flex;
  border-bottom:1px solid #f2f2f2;


  .img{
    width: 70px;
    height: 70px;
    object-fit: cover;

    &[data-src]{
      opacity: 0.2;
      transition:opacity 0.3s;
    }

    &[lazyload-status=loaded]{
      opacity: 1;
    }
  }
  

  .content-wrap{
    flex: 1;
    padding-left:15px;
  }

  .title{
    font-size:16px;
    color: #444;
  }

  .content{
    padding-top:2px;
    font-size:12px;
    color: #666;
  }

  .price-wrap{
    padding-top:6px;
    display:flex;
    justify-content: space-between;
    align-items: center;
  }

  .price{
    font-size:20px;
    color: #e66;
  }

  .sale{
    font-size:12px;
    color: #999;
  }

  .btn-wrap{
    display: flex;
    padding-left: 15px;
    align-items: center;
  }

  .btn{
    border: none;
    background: rgb(35, 154, 233);
    color: #fff;
    height: 22px;
    width: 22px;
    line-height: 22px;
    vertical-align: center;
    font-size: 18px;
    border-radius: 50%;
  }
}
</style>