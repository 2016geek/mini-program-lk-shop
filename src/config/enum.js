const enumData = {
  COLOR: [
    {
      value: "黑色",
      label: "黑色"
    },
    {
      value: "白色",
      label: "白色"
    }
  ],
  LENGTH: [
    {
      value: 380,
      label: 380
    },
    {
      value: 550,
      label: 550
    }
  ],
  ORDER_TYPE: [
    {
      value: 1,
      label: "纸质手提袋"
    },
    {
      value: 2,
      label: "笔记本"
    }
  ],
  PAPER_TYPE: [],
  // 工艺类型
  CRAFT: [
    {
      value: 11,
      type: 1,
      label: "普通胶印",
      showArea: false
    },
    {
      value: 21,
      type: 1,
      label: "丝印",
      showArea: false
    },
    {
      value: 31,
      type: 1,
      label: "uv印刷",
      showArea: false
    },
    {
      value: 3,
      label: "烫金",
      showArea: true
    },
    {
      value: 2,
      label: "UV",
      showArea: true
    },
    {
      value: 5,
      label: "压纹",
      showArea: false
    },
    {
      value: 4,
      label: "凹凸",
      showArea: false
    }
  ],
  LINE_TYPE: [
    {
      value: 1,
      label: "股绳"
    },
    {
      value: 2,
      label: "园纸绳"
    },
    {
      value: 3,
      label: "扁纸绳"
    },
    {
      value: 4,
      label: "穿孔丝带"
    },
    {
      value: 5,
      label: "打钉丝带"
    },
    {
      value: 6,
      label: "无绳"
    }
  ],
  STRUCTURE: [
    {
      value: 1,
      label: "翻口",
      url:
        "https://hzliangke.oss-cn-hangzhou.aliyuncs.com/web/progress/struct1%402x.png"
    },
    {
      value: 2,
      label: "平口",
      url:
        "https://hzliangke.oss-cn-hangzhou.aliyuncs.com/web/progress/struct2%402x.png"
    }
  ]
}
export default enumData