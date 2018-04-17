Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 产品对象
function Product(id, name, price, num, shopId) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.num = num;
    this.shopId = shopId;
}

// 购物车对象
function ShopCar() {
    //存储对象
    this.productArr = [];

    // 初始化时间
    this.initEvent();
}

// 添加产品
ShopCar.prototype.add = function (p) {
    this.productArr.push(p);
    console.log("成功添加一个商品：", this.productArr);
}


// 更新店铺总结
ShopCar.prototype.updateShopTotalPrice = function (shopId) {
    var selector = '.shop-group-item[data-id="' + shopId + '"]'
    var shopGroupItem = $(selector);
    var shopTotalNum = 0;
    // shopTotal.text;

    for (var i = 0; i < this.productArr.length; i++) {
        if (this.productArr[i]['shopId'] === shopId) {
            shopTotalNum += this.productArr[i]['num'] * this.productArr[i]['price'];
        }
    }
    var shopTotal = shopGroupItem.find('.ShopTotal');
    shopTotal.text(shopTotalNum.toFixed(2));
}

// 删除商品
ShopCar.prototype.del = function () { }
// 找产品
ShopCar.prototype.findProduct = function (id) { }

// 创建产品
ShopCar.prototype.createProduct = function (shopInfo) {
    var shopId = shopInfo.parents(".shop-group-item").data('id');
    var id = shopInfo.data('id');
    var name = shopInfo.find('h4').text();
    var price = +shopInfo.find('.price').text();
    var num = +shopInfo.find('.num').text();
    var pro = new Product(id, name, price, num, shopId);

    return pro;
}

// 选中
ShopCar.prototype.check = function (dom) {
    var shopInfo = $(dom).parents('.shop-info');
    var pro = this.createProduct(shopInfo);
    // 保存到购物车
    this.add(pro);
    // 更新价格
    this.updateTotalPrice();
    // 更新店铺价格
    this.updateShopTotalPrice(pro.shopId);
}
// 删除商品，通过id删除
ShopCar.prototype.delete = function (id) {
    //要删除，第一步找到这个元素
    for (var i = 0; i < this.productArr.length; i++) {
        if (this.productArr[i]['id'] === id) {
            this.productArr.remove(this.productArr[i]);
        }
    }

    this.updateTotalPrice();
}
// 取消选中
ShopCar.prototype.uncheck = function (dom) {
    var shopId = $(dom).parents('.shop-group-item').data('id');
    var shopInfo = $(dom).parents('.shop-info');
    var id = shopInfo.data('id');
    for (var i = 0; i < this.productArr.length; i++) {
        if (this.productArr[i]['id'] === id) {
            this.productArr.remove(this.productArr[i]);
        }
    }
    this.updateTotalPrice();
    this.updateShopTotalPrice(shopId);
}

// 添加num
ShopCar.prototype.plus = function (dom) {
    var shopId = $(dom).parents('.shop-group-item').data('id');
    var shopInfo = $(dom).parents('.shop-info');
    var id = shopInfo.data('id');
    var name = shopInfo.find('h4').text();
    var price = parseInt(shopInfo.find('.price').text());
    var num = +shopInfo.find('.num').text();
    num++;
    shopInfo.find('.num').text(num)
    // isChecked[0].checked 原生的用法
    // jq用法 isChecked.is(':checked')
    // isChecked[0] jq数组转换为原生
    // dom对象转换为jq， $(DOM)
    var checkDom = shopInfo.find('.goods-check').is(':checked');

    if (checkDom) {// 如何选中，则更新num
        // 怎么改变
        for (var i = 0; i < this.productArr.length; i++) {
            if (this.productArr[i]['id'] === id) {
                var obj = this.productArr[i];
                obj.num = num;
            }
        }
        this.updateTotalPrice();
        this.updateShopTotalPrice(shopId);
    } else {

    }
    console.log(name, price, num, checkDom);
}
// 判断是否已经全选
ShopCar.prototype.checkAll = function (dom) {
    var shopGroupItem = $(dom).parents('.shop-group-item');
    var checkList = shopGroupItem.find(".goodsCheck");
    var flag = false;
    checkList.each(function (index, item) {
        //console.log(this)
        var isCheck = $(this).is(':checked');
        if (!isCheck) {//只要有一个未选中，则全选不选中
            flag = true;
        }
    })
    if (flag) {//表示有一个未选中
        shopGroupItem.find(".shopCheck").prop('checked', false);
    } else {
        shopGroupItem.find(".shopCheck").prop('checked', true);
    }
}
// 减少num 
ShopCar.prototype.minus = function (dom) {
    var shopId = $(dom).parents('.shop-group-item').data('id');
    var shopInfo = $(dom).parents('.shop-info');
    var id = shopInfo.data('id');
    var checkDom = shopInfo.find('.goods-check').is(':checked');
    var num = +shopInfo.find('.num').text();
    if (num > 0) {
        num--;
    }
    shopInfo.find('.num').text(num);
    if (checkDom) {
        for (var i = 0; i < this.productArr.length; i++) {// 找到元素，改变num
            if (this.productArr[i]['id'] === id) {
                this.productArr[i]['num'] = num;
            }
        }
        // 更新总价
        this.updateTotalPrice();
        this.updateShopTotalPrice(shopId);
    }
}
// 判断商品是否存在
ShopCar.prototype.isExit = function (id) {
    // 通过商品id找productArr,如果找到，就表示有，没找到，就是没有
    var flag = false;//没有
    for (var i = 0; i < this.productArr.length; i++) {
        if (this.productArr[i]['id'] === id) {
            flag = true;
        }
    }
    return flag;
}


// initEvent
ShopCar.prototype.initEvent = function () {
    var that = this;
    // 绑定选中时间
    $(".goodsCheck").click(function () {
        // this点击谁就是谁
        if (this.checked) { // 如果选中，则添加
            that.check(this);
        } else {// 否则，删除商品
            that.uncheck(this);
        }

        // 检查全选
        that.checkAll(this);
    })

    // 绑定添加功能
    $(".plus").click(function () {
        that.plus(this);
        // console.log(name,price,num ,checkDom);
    })


    // 绑定减少
    $(".minus").click(function () {
        that.minus(this);
    })

    // 绑定店铺全选
    $(".shopCheck").click(function () {
        // var shopId = $(this).parents('.shop-group-item').data('id');
        var isCheck = $(this).is(':checked');
        // console.log(isCheck);
        var shopGroupItem = $(this).parents('.shop-group-item');

        var shopId = shopGroupItem.data('id');
        var shopInfoArr = shopGroupItem.find('.shop-info');
        // var newArr = [];
        for (var i = 0; i < shopInfoArr.length; i++) {
            var shopInfo = $(shopInfoArr[i]);
            var checkDom = shopInfo.find('.goodsCheck');
            var id = $(shopInfoArr[i]).data('id');
            if (isCheck) { // 选中
                checkDom.prop('checked', true);
                // 要么添加，要么修改
                var isExit = that.isExit(id);
                if (isExit) {
                } else {//创建产品
                    var pro = that.createProduct(shopInfo);
                    that.add(pro);
                }
                // newArr.push(pro);
                // $(":checkbox").prop("checked", true);
            } else {
                checkDom.prop('checked', false);
                that.delete(id);
            }
            // checkDom.checked = true;
        }

        // that.productArr = newArr; // 把数据替换原来的数据
        that.updateTotalPrice();
        that.updateShopTotalPrice(shopId);
    })


    // 全选
    $("#AllCheck").click(function () {
        var isCheck = $(this).is(':checked');
        var shopGroupItemList = $(".shop-group-item");

        shopGroupItemList.each(function () {
            if (isCheck) {// 如果选中，做什么
                $(this).find('.shopCheck').prop('checked', true);
            } else {
                $(this).find('.shopCheck').prop('checked', false);
            }
            var shopInfoList = $(this).find('.shop-info');
            shopInfoList.each(function () {
                var shopId = $(this).parents('.shop-group-item').data('id');
                var shopInfo = $(this);
                var id = shopInfo.data('id');
                // console.log('id',id);
                if (isCheck) {// 如果选中，做什么
                    $(this).find('.goodsCheck').prop('checked', true);

                    // 先拿到checkbox选中态
                    // var ckboxStatus = shopInfo.find();
                    var isExit = that.isExit(id);
                    if (!isExit) {
                        var pro = that.createProduct(shopInfo);
                        that.add(pro);
                    }
                } else {
                    $(this).find('.goodsCheck').prop('checked', false);
                    that.productArr = [];
                }

                // 更新价格
                that.updateTotalPrice();
                that.updateShopTotalPrice(shopId);
            })
        })

    })
}

// 更新价格
ShopCar.prototype.updateTotalPrice = function () {
    var total = 0;
    for (var i = 0; i < this.productArr.length; i++) {
        total += this.productArr[i]['price'] * this.productArr[i]['num'];
    }
    $("#AllTotal").text(total.toFixed(2));
}

// 第一步：使用对象
window.onload = function () {
    var shop = new ShopCar();
}