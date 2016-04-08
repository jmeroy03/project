$(function () {
                $('#datetimepicker5').datetimepicker({
                    defaultDate: "11/1/2014",
                    disabledDates: [
                        moment("12/25/2014"),
                        new Date(2013, 11 - 1, 21),
                        "11/22/2013 00:53"
                    ]
                });
            });