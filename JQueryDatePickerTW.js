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

    // ��0�禡
    var padLeft = function(str, len){
        if(str.length >= len){
            return str;
        }else{
            return padLeft(("0" + str), len);
        }
    };


    // ���Ӧ���n�����k
    var funcColle = {
        onSelect: {
            basic: function(dateText, inst){
                /*
                var yearNative = inst.selectedYear < 1911
                    ? inst.selectedYear + 1911 : inst.selectedYear;*/
                dateNative = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);

                // �~���p��100�|�Q�ɦ�19**, �n���ҥ~�B�z
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
        closeText: '����',
        prevText: '�W�Ӥ�',
        nextText: '�U�Ӥ�',
        currentText: '����',
        monthNames: ['�@��','�G��','�T��','�|��','����','����',
            '�C��','�K��','�E��','�Q��','�Q�@��','�Q�G��'],
        monthNamesShort: ['�@��','�G��','�T��','�|��','����','����',
            '�C��','�K��','�E��','�Q��','�Q�@��','�Q�G��'],
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
        }
    };

    // ��yearText��������
    var replaceYearText = function(){
        var $yearText = $('.ui-datepicker-year');

        if(twSettings.changeYear !== true){
            $yearText.text('����' + dateTW.getFullYear());
        }else{
            // �U�Կ��
            if($yearText.prev('span.datepickerTW-yearPrefix').length === 0){
                $yearText.before("<span class='datepickerTW-yearPrefix'>����</span>");
            }
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
            //onSelect�ҥ~�B�z, �קK�л\
            if(typeof options.onSelect === 'function'){
                funcColle.onSelect.newFunc = options.onSelect;
                options.onSelect = twSettings.onSelect;
            }
            // year range���W�Ʀ��褸, �p��1911���Ʀr���|�Q������~
            if(options.yearRange){
                var temp = options.yearRange.split(':');
                for(var i = 0; i < temp.length; i += 1){
                    //����e�B�z
                    if(parseInt(temp[i]) < 1 ){
                        temp[i] = parseInt(temp[i]) + 1911;
                    }else{
                        temp[i] = parseInt(temp[i]) < 1911
                            ? parseInt(temp[i]) + 1911
                            : temp[i];
                    }
                }
                options.yearRange = temp[0] + ':' + temp[1];
            }
            // if input val not empty
            if($(this).val() !== ''){
                options.defaultDate = $(this).val();
            }
        }

        // setting after init
        if(arguments.length > 1){
            // �ثe�٨S�Q�쥿�`���Ѫk, �����ഫ��init setting obj���Φ�
            if(arguments[0] === 'option'){
                options = {};
                options[arguments[1]] = arguments[2];
            }
        }

        // override settings
        $.extend(twSettings, options);

        // init
        $(this).datepicker(twSettings);

        // beforeRender
        $(this).click(function(){
            var isFirstTime = ($(this).val() === '');

            // year range and default date

            if((twSettings.defaultDate || twSettings.yearRange) && isFirstTime){

                if(twSettings.defaultDate){
                    $(this).datepicker('setDate', twSettings.defaultDate);
                }

                // ��year range��, select��l�Ƴ]��range���̥��~
                if(twSettings.yearRange){
                    var $yearSelect = $('.ui-datepicker-year'),
                        nowYear = twSettings.defaultDate
                            ? $(this).datepicker('getDate').getFullYear()
                            : dateNative.getFullYear();

                    $yearSelect.children(':selected').removeAttr('selected');
                    if($yearSelect.children('[value=' + nowYear + ']').length > 0){
                        $yearSelect.children('[value=' + nowYear + ']').attr('selected', 'selected');
                    }else{
                        $yearSelect.children().last().attr('selected', 'selected');
                    }
                }
            } else {
                $(this).datepicker('setDate', dateNative);
            }

            $(this).val($.datepicker.formatDate(twSettings.dateFormat, dateTW));

            replaceYearText();

            if(isFirstTime){
                $(this).val('');
            }
        });

        // afterRender
        $(this).focus(function(){
            replaceYearText();
        });

        return this;
    };

})();


