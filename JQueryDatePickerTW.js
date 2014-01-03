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
                if($('.ui-datepicker-year').text().indexOf('����') < 0){
                    //$('.ui-datepicker-year').text('����' + dateTW.getFullYear());
                }
            }
        }
    };

    var twSettings = {
        closeText: '����',
        prevText: '&#x3c;�W��',
        nextText: '�U��&#x3e;',
        currentText: '����',
        monthNames: ['�@��','�G��','�T��','�|��','����','����',
            '�C��','�K��','�E��','�Q��','�Q�@��','�Q�G��'],
        monthNamesShort: ['�@','�G','�T','�|','��','��',
            '�C','�K','�E','�Q','�Q�@','�Q�G'],
        dayNames: ['�P����','�P���@','�P���G','�P���T','�P���|','�P����','�P����'],
        dayNamesShort: ['�P��','�P�@','�P�G','�P�T','�P�|','�P��','�P��'],
        dayNamesMin: ['��','�@','�G','�T','�|','��','��'],
        weekHeader: '�P',
        dateFormat: 'yy/mm/dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '�~',
        onSelect: function(dateText, inst){
            $(this).val(funcColle.onSelect.basic(dateText, inst));
            if(typeof funcColle.onSelect.newFunc === 'function'){
                funcColle.onSelect.newFunc(dateText, inst);
            }
        },
        onChangeMonthYear: function(dateText, inst){
            $(this).val(funcColle.onChangeMonthYear.basic(dateText, inst));
            if(typeof funcColle.onChangeMonthYear.newFunc === 'function'){
                funcColle.onChangeMonthYear.newFunc(dateText, inst);
            }
        }
    };


    $.fn.datepickerTW = function(options){

        // setting on init,
        if(typeof options === 'object'){
            //onSelect��onChangeMonthYear�ҥ~�B�z, �קK�л\
            if(typeof options.onSelect === 'function'){
                funcColle.onSelect.newFunc = options.onSelect;
                options.onSelect = twSettings.onSelect;
            }
            if(typeof options.onChangeMonthYear === 'function'){
                funcColle.onChangeMonthYear.newFunc = options.onChangeMonthYear;
                options.onChangeMonthYear = twSettings.onChangeMonthYear;
            }
        }

        // setting after init
        if(arguments.length > 1){
            //�ثe�٨S�Q�쥿�`���Ѫk, �����ഫ��init setting obj���Φ�
            if(arguments[0] === 'option'){
                options = {};
                options[arguments[1]] = arguments[2];
            }
        }


        // override settings
        $.extend(twSettings, options);

        // init
        $(this).datepicker(twSettings);

        // �n���צ��褸�~
        $(this).click(function(){
            if($(this).val() !== ''){
                $(this).datepicker('setDate', dateNative);
                $(this).val($.datepicker.formatDate(twSettings.dateFormat, dateTW));
            }
            //$('.ui-datepicker-year').text('����' + dateTW.getFullYear());
        });

        return this;
    };

})();


