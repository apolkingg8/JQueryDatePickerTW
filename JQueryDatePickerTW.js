/**
 * Created by EIJI on 2014/1/3.
 */

(function(){

    var yearTextSelector = '.ui-datepicker-year';

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
                dateNative = new Date(yearNative, inst.selectedMonth, inst.selectedDay);

                // 年分小於100會被補成19**, 要做例外處理
                var yearTW = inst.selectedYear > 1911
                    ? (inst.selectedYear - 1911) < 100
                        ? '00' + (inst.selectedYear - 1911)
                        : (inst.selectedYear - 1911) < 999
                            ? '0' + (inst.selectedYear - 1911)
                            : inst.selectedYear - 1911
                    : inst.selectedYear;
                var monthTW = inst.selectedMonth + 1 < 10
                    ? '0' + (inst.selectedMonth + 1) : inst.selectedMonth + 1;
                var dayTW = inst.selectedDay < 10
                    ? '0' + inst.selectedDay : inst.selectedDay;

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
        monthNames: ['一月','二月','三月','四月','五月','六月',
            '七月','八月','九月','十月','十一月','十二月'],
        monthNamesShort: ['一月','二月','三月','四月','五月','六月',
            '七月','八月','九月','十月','十一月','十二月'],
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesMin: ['日','一','二','三','四','五','六'],
        weekHeader: '周',
        dateFormat: 'yy/mm/dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年',

        onSelect: function(dateText, inst){
            $(this).val(funcColle.onSelect.basic(dateText, inst));
            if(typeof funcColle.onSelect.newFunc === 'function'){
                funcColle.onSelect.newFunc(dateText, inst);
            }
        }
    };

    // 把yearText換成民國
    var replaceYearText = function(){
        var $yearText = $('.ui-datepicker-year');

        if(twSettings.changeYear !== true){
            $yearText.text('民國' + dateTW.getFullYear());
        }else{
            $yearText.children().each(function(){
                if(parseInt($(this).text()) > 1911){
                    $(this).text(parseInt($(this).text()) - 1911);
                }
            });
        }
    };


    $.fn.datepickerTW = function(options){

        // setting on init,
        if(typeof options === 'object'){
            //onSelect例外處理, 避免覆蓋
            if(typeof options.onSelect === 'function'){
                funcColle.onSelect.newFunc = options.onSelect;
                options.onSelect = twSettings.onSelect;
            }
            // year range正規化成西元
            if(options.yearRange){
                var temp = options.yearRange.split(':');
                for(var i = 0; i < temp.length; i += 1){
                    temp[i] = parseInt(temp[i]) < 1911
                        ? parseInt(temp[i]) + 1911
                        : temp[i];
                }
                options.yearRange = temp[0] + ':' + temp[1];
            }
        }

        // setting after init
        if(arguments.length > 1){
            // 目前還沒想到正常的解法, 先用轉換成init setting obj的形式
            if(arguments[0] === 'option'){
                options = {};
                options[arguments[1]] = arguments[2];
            }
        }

        // override settings
        $.extend(twSettings, options);

        // init
        $(this).datepicker(twSettings);

        // 修成西元年
        $(this).click(function(){

            var isFirstTime = ($(this).val() === '');

            // 當有year range時, 初始化設成range的最末年
            if(twSettings.yearRange && isFirstTime){
                dateNative.setFullYear(twSettings.yearRange.split(':')[1]);
            }
            $(this).datepicker('setDate', dateNative);
            $(this).val($.datepicker.formatDate(twSettings.dateFormat, dateTW));

            replaceYearText();

            if(isFirstTime){
                $(this).val('');
            }
        });

        $(this).focus(function(){
            replaceYearText();
        });

        return this;
    };

})();


