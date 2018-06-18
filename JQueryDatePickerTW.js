/**
 * Created by EIJI on 2014/1/3.
 * ToDo Bug 2018.02.09 行 152 在使用 class 的方式宣告時，會導致沒有初始值的欄位出現初始值，需要做處理，否則在行 198 的地方設置初始值或預設值只能二擇一
 */

(function () {
    var _this;
    var yearTextSelector = '.ui-datepicker-year';

    var dateNative = new Date(),
        dateTW = new Date(
            dateNative.getFullYear() - 1911,
            dateNative.getMonth(),
            dateNative.getDate()
        );
    var _currentYear = dateTW.getFullYear();
    // 補0函式
    var padLeft = function (str, len) {
        if (str.toString().length >= len) {
            return str;
        } else {
            return padLeft(("0" + str), len);
        }
    };


    // 應該有更好的做法
    var funcColle = {
        onSelect: {
            basic: function (dateText, inst) {
                /*
                var yearNative = inst.selectedYear < 1911
                    ? inst.selectedYear + 1911 : inst.selectedYear;*/
                dateNative = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);

                // 年分小於100會被補成19**, 要做例外處理
                var yearTW = inst.selectedYear > 1911
                    ? padLeft(inst.selectedYear - 1911, 4)
                    : inst.selectedYear;
                var monthTW = padLeft(inst.selectedMonth + 1, 2);
                var dayTW = padLeft(inst.selectedDay, 2);
                dateTW = new Date(
                    yearTW + '-' +
                    monthTW + '-' +
                    dayTW + 'T00:00:00.000Z'
                );

                return $.datepicker.formatDate(twSettings.dateFormat, dateTW);
            }
        }
    };

    var twSettings = {
        closeText: '關閉',
        prevText: '上個月',
        nextText: '下個月',
        currentText: '今天',
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        weekHeader: '周',
        dateFormat: 'yy/mm/dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年',
        isShowClear: false,
        clearText: "清除",

        onSelect: function (dateText, inst) {
            $(this).val(funcColle.onSelect.basic(dateText, inst));
            if (typeof funcColle.onSelect.newFunc === 'function') {
                funcColle.onSelect.newFunc(dateText, inst);
            }
        },
        onChangeMonthYear: function (year, month, inst) {
            _currentYear = (parseInt(year) - 1911);
        },
        beforeShow: function (input) {
            _this = $(input);
        }
    };

    // 把yearText換成民國
    var replaceYearText = function () {
        var $yearText = $(yearTextSelector);

        if (twSettings.changeYear !== true) {
            $yearText.text('民國' + _currentYear);
        } else {
            // 下拉選單
            if ($yearText.prev('span.datepickerTW-yearPrefix').length === 0) {
                $yearText.before("<span class='datepickerTW-yearPrefix'>民國</span>");
            }
            $yearText.children().each(function () {
                if (parseInt($(this).text()) > 1911) {
                    $(this).text(parseInt($(this).text()) - 1911);
                }
            });
        }

        // 增加自定義按紐
        if (twSettings.isShowClear && twSettings.showButtonPanel) {
            setTimeout(function () {
                $(".ui-datepicker-clear").remove();
                var buttonPane = _this
                    .datepicker("widget")
                    .find(".ui-datepicker-buttonpane");
                var btn = $('<button class="ui-datepicker-clear ui-state-default ui-corner-all" type="button">清除</button>');
                btn.unbind("click")
                    .bind("click", function () {
                        _this.val("");
                        _this.datepicker("hide");
                    });
                btn.appendTo(buttonPane);
            }, 1);
        }
    };

    var SetCustomButton = function () {

    };

    $.fn.datepickerTW = function (options) {
        // setting on init,
        if (typeof options === 'object') {
            //onSelect例外處理, 避免覆蓋
            if (typeof options.onSelect === 'function') {
                funcColle.onSelect.newFunc = options.onSelect;
                options.onSelect = twSettings.onSelect;
            }
            // year range正規化成西元, 小於1911的數字都會被當成民國年
            if (options.yearRange) {
                var temp = options.yearRange.split(':');
                for (var i = 0; i < temp.length; i += 1) {
                    //民國前處理
                    if (parseInt(temp[i]) < 1) {
                        temp[i] = parseInt(temp[i]) + 1911;
                    } else {
                        temp[i] = parseInt(temp[i]) < 1911
                            ? parseInt(temp[i]) + 1911
                            : temp[i];
                    }
                }
                options.yearRange = temp[0] + ':' + temp[1];
            }
            // if input val not empty
            if ($(this).val() !== '') {
                options.defaultDate = $(this).val();
            }
        }

        // setting after init
        if (arguments.length > 1) {
            // 目前還沒想到正常的解法, 先用轉換成init setting obj的形式
            if (arguments[0] === 'option') {
                options = {};
                options[arguments[1]] = arguments[2];
            }
        }

        // override settings
        $.extend(twSettings, options);

        // init
        $(this).datepicker(twSettings);

        // beforeRender
        $(this).click(function () {
            var isFirstTime = ($(this).val() === '');
            var currentDateNative = dateNative;
            var currentDateTW = dateTW;

            if ($(this).val() !== "") {
                var _date = $(this).val().split(/-|\/|\\|_|\./g);
                currentDateNative = new Date(
                    parseInt(_date[0]) + 1911,
                    parseInt(_date[1]) - 1,
                    _date[2]
                );
            } else {
                currentDateNative = new Date();
            }
            currentDateTW = new Date(
                    currentDateNative.getFullYear(),
                    currentDateNative.getMonth(),
                    currentDateNative.getDate()
                );
            currentDateTW.setFullYear(currentDateTW.getFullYear() - 1911);

            // year range and default date

            if ((twSettings.defaultDate || twSettings.yearRange) && isFirstTime) {
                var setDateVal = currentDateTW.getFullYear() + "-" + (currentDateTW.getMonth() + 1) + "-" + currentDateTW.getDate();
                $(this).datepicker('setDate', setDateVal);
                //if (twSettings.defaultDate) {
                //    $(this).datepicker('setDate', twSettings.defaultDate);
                //}

                // 當有year range時, select初始化設成range的最末年
                if (twSettings.yearRange) {
                    var $yearSelect = $('.ui-datepicker-year'),
                        nowYear = twSettings.defaultDate
                            ? ($(this).datepicker('getDate').getFullYear() + 1911)
                            : currentDateNative.getFullYear();
                    $yearSelect.val(nowYear).trigger("change");
                }
            } else {
                $(this).datepicker('setDate', currentDateNative);
            }

            $(this).val($.datepicker.formatDate(twSettings.dateFormat, currentDateTW));

            replaceYearText();

            if (isFirstTime) {
                $(this).val('');
            }
        });

        // afterRender
        $(this).focus(function () {
            replaceYearText();
        });
        return this;
    };

})();

