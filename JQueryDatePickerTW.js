/**
 * Created by EIJI on 2014/1/3.
 */

(function(){

    var dateNative = new Date(),
        dateTW = new Date(
            dateNative.getFullYear() - 1911,
            dateNative.getMonth(),
            dateNative.getDate()
        );

    // 應該有更好的做法
    var funcColle = {
        onSelect: {
            basic: function(dateText, inst){
                var yearNative = inst.selectedYear < 1911
                    ? inst.selectedYear + 1911 : inst.selectedYear;
                var yearTW = inst.selectedYear > 1911
                    ? inst.selectedYear - 1911 : inst.selectedYear;
                dateNative = new Date(yearNative, inst.selectedMonth, inst.selectedDay);
                dateTW = new Date(yearTW, inst.selectedMonth, inst.selectedDay);

                return $.datepicker.formatDate(twSettings.dateFormat, dateTW);
            }
        },
        onChangeMonthYear: {
            basic: function(dateText, inst){
                if($('.ui-datepicker-year').text().indexOf('民國') < 0){
                    //$('.ui-datepicker-year').text('民國' + dateTW.getFullYear());
                }
            }
        },
        beforeShow: {
            basic: function(input, inst){
                if($(input).val() !== ''){
                    $(input).datepicker('setDate', dateNative);
                    $(input).val($.datepicker.formatDate(twSettings.dateFormat, dateTW));
                }
                //$('.ui-datepicker-year').text('民國' + dateTW.getFullYear());
            }
        }
    };

    var twSettings = {
        closeText: '關閉',
        prevText: '&#x3c;上月',
        nextText: '下月&#x3e;',
        currentText: '今天',
        monthNames: ['一月','二月','三月','四月','五月','六月',
            '七月','八月','九月','十月','十一月','十二月'],
        monthNamesShort: ['一','二','三','四','五','六',
            '七','八','九','十','十一','十二'],
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesMin: ['日','一','二','三','四','五','六'],
        weekHeader: '周',
        dateFormat: 'yy/mm/dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年',

        // 應該有更好的做法
        onSelect: function(dateText, inst){
            $(this).val(funcColle.onSelect.basic(dateText, inst));
            if(typeof funcColle.onSelect.newFunc === 'function'){
                funcColle.onSelect.newFunc(dateText, inst);
            }
        },
        onChangeMonthYear: function(dateText, inst){
            funcColle.onChangeMonthYear.basic(dateText, inst);
            if(typeof funcColle.onChangeMonthYear.newFunc === 'function'){
                funcColle.onChangeMonthYear.newFunc(dateText, inst);
            }
        },
        beforeShow: function(input, inst){
            funcColle.beforeShow.basic(input, inst);
            if(typeof funcColle.beforeShow.newFunc === 'function'){
                funcColle.beforeShow.newFunc(input, inst);
            }
        }
    };


    $.fn.datepickerTW = function(options){

        // setting on init,
        if(typeof options === 'object'){
            // 部分事件例外處理, 避免覆蓋
            // 應該有更好的做法
            if(typeof options.onSelect === 'function'){
                funcColle.onSelect.newFunc = options.onSelect;
                options.onSelect = twSettings.onSelect;
            }
            if(typeof options.onChangeMonthYear === 'function'){
                funcColle.onChangeMonthYear.newFunc = options.onChangeMonthYear;
                options.onChangeMonthYear = twSettings.onChangeMonthYear;
            }
            if(typeof options.beforeShow === 'function'){
                funcColle.beforeShow.newFunc = options.beforeShow;
                options.beforeShow = twSettings.beforeShow;
            }
        }

        // setting after init
        if(arguments.length > 1){
            //目前還沒想到正常的解法, 先用轉換成init setting obj的形式
            if(arguments[0] === 'option'){
                options = {};
                options[arguments[1]] = arguments[2];
            }
        }


        // override settings
        $.extend(twSettings, options);

        // init
        $(this).datepicker(twSettings);

        return this;
    };

})();


