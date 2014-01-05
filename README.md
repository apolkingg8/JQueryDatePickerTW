jQuery DatepickerTW
================================

基於jQueryUI的民國版datepicker套件

## Getting Started

### 相依檔案

[jQuery 1.6+](http://jquery.com)

[jQueryUI 1.10.3](http://jqueryui.com)

### 套件檔案

[JQueryDatePickerTW.js](https://github.com/apolkingg8/JQueryDatePickerTW/blob/master/JQueryDatePickerTW.js)

### 使用方法

在jQuery及jQueryUI之後引入JQueryDatePickerTW.js

```html
<head>
    <title>JQueryDatepickerTW Demo</title>
    <link rel="stylesheet" href="Lib/jquery-ui-1.10.3.custom.css">
    <script src="Lib/jquery-1.9.1.js"></script>
    <script src="Lib/jquery-ui-1.10.3.custom.js"></script>
    <script src="JQueryDatePickerTW.js"></script>
</head>
```

初始化方式與datepicker相同

```html
<label>
    <input type="text" class="datepickerTW">
</label>
<script type="text/javascript">
    $('.datepickerTW').datepickerTW();
</script>
```

## API Document

api使用方法皆與datepicker相同，參考http://api.jqueryui.com/datepicker/

`yearRange`使用民國或西元皆可(會把小於1911的年份都視為民國年)
```js
$('.datepickerTW').datepickerTW({
    yearRange: '98:2003' // 民國98年到102年
});
```

在option中可使用負數代表民國前，ui及text上會把民國前的年份轉為西元顯示

## Reporting an Issue

如果有發現任何的問題，請Mail給我，或是在Blog上留言

Mail: apolkingg8@gmail.com

Blog: [BlogPost - jQueryDatePicker民國版](http://apolkingg8.logdown.com/posts/173178-jquerydatepicker-republic-of-china)

## Update Notes

2014-01-05 更新民國前，修正單位數年份bug   
2014-01-04 release 1.0

## License

Copyright (c) 2014 apolkingg8
Licensed under the MIT license.
