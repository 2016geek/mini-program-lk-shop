// src/pages/login/login.js
import api from '../../api';
import { clearPromise } from '../../api/createServer';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      this.userCode = decodeURIComponent(options.scene);
    }
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
  async login(data) {
    let _this = this;
    if (!data.detail.iv || !data.detail.encryptedData) {
      wx.showToast({
        title: '您需要先授权才能访问',
        icon: 'none',
      });
      return;
    }
    wx.login({
      async success(res) {
        if (res.code) {
          try {
            const { detail: {
              encryptedData,
              iv,
            } } = data;
            const { token, ...useInfo } = await api.user.login({
              encryptedData,
              iv,
              code: res.code,
              userCode: _this.userCode,
            });
            const app = getApp();
            app.globalData.token = token;
            app.globalData.userInfo = useInfo;
            console.log('userInfo', useInfo);
            clearPromise();
            wx.reLaunch({
              url: '/pages/tabs/customMade/customMade',
            });
          }
          catch (data) {
            console.log(data);
            // wx.navigateTo({
            // 	url: '/pages/guide/welcome/welcome',
            // });
          }
        }
      },
    });
  },
})
  ;
