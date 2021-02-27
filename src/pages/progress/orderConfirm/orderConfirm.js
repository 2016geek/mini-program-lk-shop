// src/pages/progress/orderConfirm/orderConfirm.js
import api from '../../../api';
import enumData from '../../../config/enum';
import { areaComputed } from '../../../utils/util';
import { computedCraft, computedRope, getEnumLabel } from '../../../utils/order';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: [

    ],
    totalPrice: 2313,
    address: {
      contactName: '',
      contactPhone: '',
      addressDetail: '',
      province: '',
      city: '',
      area: '',
      id: '',
    },
    previewPic: '',
    orderId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const { orderId } = options;
    this.setData({ orderId });
    const [orderDetail, addressList] = await Promise.all([api.user.getOrderDetail(orderId)(), api.user.getAddressList()]);
    this.setData({ form: this.formatForm(orderDetail), previewPic: orderDetail.previewPic, address: this.addressChose(addressList) });
  },
  onAddressTap() {
    const _this = this;
    wx.chooseAddress({
      async success(res) {
        _this.handlerChoseAddress(res);
      },
      fail(res) {
        console.log(res, 'fail');
      },
    });
  },
  async handlerChoseAddress(res) {
    const { cityName, countyName, detailInfo, provinceName, telNumber, userName } = res;
    const { contactName, contactPhone, addressDetail, province, city, area } = this.data.address;
    if (cityName === city && provinceName === province && countyName === area && addressDetail === detailInfo) {
    }
    else {
      console.log(cityName, city);

      const res = await api.user.addAddress({
        province: provinceName,
        city: cityName,
        area: countyName,
        addressDetail: detailInfo,
        contactName: userName,
        contactPhone: telNumber,
      });
      this.setData({
        address: {
          id: res.id,
          province: provinceName,
          city: cityName,
          area: countyName,
          addressDetail: detailInfo,
          contactName: userName,
          contactPhone: telNumber,
        },
      });
    }
  },
  addressChose(list) {
    if (!list.length) {
      return {};
    }
    let choseItem = {};
    const chose = list.find((v) => v.defaultAddress);
    if (!chose) {
      choseItem = list[0];
    }
    else {
      choseItem = chose;
    }
    return choseItem;
  },
  formatForm(config) {
    const {
      structureType,
      length,
      width,
      height,
      goodsCount,
      extraCraft,
      rope,
      deliveryDate,
      weight,
      paperName,
    } = config;
    return [
      {
        name: '结构',
        value: getEnumLabel(enumData.STRUCTURE, structureType),
      },
      {
        name: '材料',
        value: paperName,
      },
      { name: '尺寸', value: `${length} X ${height} X ${width}MM` },
      { name: '数量', value: goodsCount },
      { name: '工艺', value: computedCraft(JSON.parse(extraCraft)) },
      { name: '绳子', value: computedRope(JSON.parse(rope)) },
      { name: '数量', value: goodsCount },
      { name: '预计工期', value: deliveryDate },
      { name: '预计货品质量', value: weight / 1000 + 'KG' },
    ];
  },
  async copyTable() {
    const { orderExcelFile } = await api.user.getOrderDetail(this.data.orderId)();
    if (!orderExcelFile) {
      wx.showToast({
        title: '表格正在导出，请稍后再试',
        icon: 'none',
      });
      return;
    }
    wx.downloadFile({
      url: orderExcelFile,
      success: function (res) {
        const filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          fileType: 'xlsx',
          showMenu: true,
          success: function (res) {
          },
          fail: function (err) {
            console.log('openFail', err);
          },
        });
      },
      fail: function (err) {
        console.log('下载失败', err);
      },
    });
  },
  async submit() {
    const { address: { id }, orderId } = this.data;
    await api.user.submitForm({
      addressId: id,
      orderId,
    });
    wx.showToast({
      title: '提交成功',
      icon: 'success',
    });
    wx.navigateTo({
      url: '/pages/progress/complete/complete?id=' + orderId,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})
  ;
