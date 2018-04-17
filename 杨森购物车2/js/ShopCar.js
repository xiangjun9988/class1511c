Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 抽象： 
//  抽取属性  图片地址： imgurl , 产品名称： name , 单价： price, 数量： number
//  抽取方法  单选:check ， 删除： delete， 加: add， 减: dec(有道或百度)

function Product(id, name, price, num) {
    // 产品编号
    this.id = id;
    //  产品名称
    this.name = name;
    // 单价
    this.price = price;
    // 总数
    this.num = num;
}

// 抽象属性
function ShopCar() {
    // 存储商品
    this.productArr = [];

    this.initEvent();
}
// 添加产品 
ShopCar.prototype.add = function (pro) {
    this.productArr.push(pro);
}
// 减少产品 
ShopCar.prototype.dec = function () { }
// 删除产品 
ShopCar.prototype.delete = function () { }
// 单选产品 
ShopCar.prototype.check = function (dom) {
    var shopInfo = $(dom).parent('.shop-info');



    var name = shopInfo.find('h4').text();
    var price = +shopInfo.find('.price').text();
    var num = +shopInfo.find('.num').text();
    // var id = $(dom).data('id');
    var pro = new Product(shopInfo.data('id'),name, price, num);
    // 添加商品
    this.add(pro);
    // 更新价格
    this.updateAllTotal();
 }
 // 取消选中
// 单选产品 
ShopCar.prototype.uncheck = function(dom){
    var arr = this.productArr;
    var shopInfo = $(dom).parents('.shopInfo');
    for (var i = 0; i < arr.length; i++) {
        if (shopInfo.data('id') === arr[i]['id']){
            console.log('找到了dom');
            this.productArr.remove(arr[i]);
            this.updateAllTotal();
        }
    }
}
// 更新购物车
ShopCar.prototype.updateAllTotal = function(){
    var arr = this.productArr;
    var total = 0;
    for(var i = 0; i< arr.length; i++){
        total += arr[i]['price']*arr[i]['num'];
    }
    $("#AllTotal").text(total);
}
ShopCar.prototype.findProduct = function(id){
    var obj = null;
    for(var i = 0; i < this.productArr.length; i++){
        if(this.productArr[i]['id'] === id){
            console.log('hahahah,找到了');
            obj = this.productArr[i];
        }
    }
    obj.num = 100;

    
    return obj;
}
// 初始化initEvent
ShopCar.prototype.initEvent = function(){
    var that = this;
    // 选中和反选单个商品
    $(".goodsCheck").click(function (ev) {
        if (this.checked){// 如果选中
            that.check(this);
        }else{//如果反选
            that.uncheck(this);
        }
    })

    // 点击结算，跳转

    // 绑定加
    $(".plus").click(function(){
        // $(this)
        // console.log(this);
        // var num =  +$(this).siblings('.num').text() + 1;
        // $(this).siblings('.num').text(num);

        // 找共同父元素
        var shopInfo = $(this).parents('.shop-info');
        var isChecked = shopInfo.find('.goods-check');
        // isChecked[0].checked 原生的用法
        // jq用法 isChecked.is(':checked')
        // isChecked[0] jq数组转换为原生
        // dom对象转换为jq， $(DOM)
        var numDom = shopInfo.find('.num');
        var num = +numDom.text() + 1;
            numDom.text(num);
        if (isChecked.is(':checked')){//选中， 则更新价格
            var id = shopInfo.data('id');
            var obj = that.findProduct(id);
            if(obj){
                obj.num = num;
                that.updateAllTotal();
            }
            
        }else{ // 不更新

        }

        // console.log(shopInfo, isChecked.checked);
    })

    // 绑定减少
    $(".minus").click(function(){
        // 找共同父元素
        var shopInfo = $(this).parents('.shop-info');
        var isChecked = shopInfo.find('.goods-check');
        // isChecked[0].checked 原生的用法
        // jq用法 isChecked.is(':checked')
        // isChecked[0] jq数组转换为原生
        // dom对象转换为jq， $(DOM)
        var numDom = shopInfo.find('.num');
        var num = +numDom.text();
        if(num > 0){
            num --;
        }
        if (isChecked.is(':checked')) {//选中， 则更新价格
            var id = shopInfo.data('id');
            var obj = that.findProduct(id);
            if (obj) {
                obj.num = num;
                that.updateAllTotal();
            }

        }
        numDom.text(num);
    })
}

// 结算
ShopCar.prototype.submit = function () { }




window.onload = function(){
    var shop = new ShopCar();
}

// 用面向对象写购物车：
// 第一步： 写大对象 
   // 产品， 购物 

// 第二步： 确定需要的属性和方法

// 第三步： 梳理业务逻辑（功能需求）
