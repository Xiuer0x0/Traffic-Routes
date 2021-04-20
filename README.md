# Traffic Routes
作為個人學習 Typescript 之練習使用，僅實做一些簡單功能

[Demo Page](https://xiuer0x0.github.io/Traffic-Routes/)

+ 將搜尋的公車路線繪製於地圖上 （使用 sample data 故路線不齊全）
+ 建議使用 PC、平板操作

# Build

```shell
npm install 

npm run dev
```

# Datasource

## [交通部數據匯流平台](https://ticp.motc.gov.tw/ConvergeProj/dataService/dataDownload)

+ 臺北市區公車路線站牌資料 [roadMap_sample.csv](https://ticp.motc.gov.tw/ConvergeProj/dataService/dataDownload?keyword=%E8%87%BA%E5%8C%97%E5%B8%82%E5%8D%80%E5%85%AC%E8%BB%8A%E8%B7%AF%E7%B7%9A%E7%AB%99%E7%89%8C%E8%B3%87%E6%96%99)

## [台北市公共運輸處](https://www.pto.gov.taipei/Default.aspx)

+ 公車站牌資訊 [GetStop.json](https://tcgbusfs.blob.core.windows.net/blobbus/GetStop.gz)
+ 公車路線資訊 [GetRoute.json](https://tcgbusfs.blob.core.windows.net/blobbus/GetRoute.gz)
+ [API 說明文件](https://www.pto.gov.taipei/News_Content.aspx?n=A1DF07A86105B6BB&s=55E8ADD164E4F579&sms=2479B630A6BD8079)