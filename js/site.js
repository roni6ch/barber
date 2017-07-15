/** **********************************ANGULAR*************************************** */

var app = angular.module('barberApp', ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        }).when('/price', {
        templateUrl: 'pages/price.html',
        controller: 'priceController'
    }).when('/gallery', {
        templateUrl: 'pages/gallery.html',
        controller: 'galleryController'
    }).when('/coupons', {
        templateUrl: 'pages/coupons.html',
        controller: 'couponsController'
    }).when('/about', {
        templateUrl: 'pages/about.html',
        controller: 'aboutController'
    }).when('/customers', {
        templateUrl: 'pages/customers.html',
        controller: 'customersController'
    });
});

/*
 * ********************* index Controller ****************
 */

app.controller('indexController', function ($scope) {

});
/*
 * ********************* home Controller ****************
 */

app.controller('homeController', function ($scope, $http, $timeout) {
    $(".fa-spin").hide();
    var months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
    angular.element('#datetimepicker12').datetimepicker({
        inline: true,
        sideBySide: true
    });

    $scope.order = function () {
        $(".youtube").fadeOut("slow", function () {
            // Animation complete.
            $(".youtube").remove();
        });


        $(".order").fadeOut("slow", function () {
            $(".homeWrap").fadeIn("slow", function () {
                // Animation complete.
            });
            $(".color-6").fadeIn("slow", function () {
                // Animation complete.
            });
        });

    }

    $scope.submitNewOrder = function (modalNum) {
        $(".fa-spin").show();
        if ($('.datetimepicker-minutes .active').html() != undefined)
            var minutes = $('.datetimepicker-minutes .active').html().split(":")[1];
        var hour = "00";
        if ($('.datetimepicker-hours .active').html()) {
            // console.log($('.datetimepicker-hours .active').html());
            hour = $('.datetimepicker-hours .active').html().split(":")[0];
        }
        var year = $('.datetimepicker-months .switch').html();
        var month = $('.datetimepicker-days .switch').html().split(" ")[0];
        var day = $('.datetimepicker-hours .switch').html().split(" ")[0];
        var name = $("#user_name").val();
        var haircut = $("#user_haircut option:selected").val();
        var notes = $("#user_notes").val();
        var monthConvertedToInt = months.indexOf(month) + 1;


        if (year == undefined || year == "" || minutes == undefined || minutes == "" || month == undefined || month == "" || day == undefined || day == "" || hour == "" || hour == undefined || name == "" || haircut == "") {
            $scope.modalText = "אנא הזן תאריך, שעה ושם";
            $scope.hour = "";
            $scope.haircut = "";
            $("." + modalNum).click();
        }
        else {
            /* console.log("name: " + $("#user_name").val());
             console.log("notes: " + $("#user_notes").val());
             console.log("haircut: " + $("#user_haircut option:selected").val());

             console.log("year: " + $('.datetimepicker-months .switch').html());
             console.log("month: " + $('.datetimepicker-days .switch').html().split(" ")[0]);
             console.log("day: " + $('.datetimepicker-hours .switch').html().split(" ")[0]);
             console.log("hour: " + $('.datetimepicker-hours .active').html().split(":")[0]);
             console.log("minutes: " + $('.datetimepicker-minutes .active').html().split(":")[1]);*/

            $scope.name = name;
            $scope.day = day;
            $scope.hour = "לשעה: " + hour + ":" + minutes;
            $scope.haircut = "לתספורת: " + haircut;
console.log("a");
            $http({
                url: "db.php",
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $.param({
                    'newCustomer': "newCustomer",
                    'fullDate': year + monthConvertedToInt + day + hour + minutes,
                    'year': year,
                    'month': month,
                    'convertedMonth': monthConvertedToInt,
                    'day': day,
                    'hour': hour,
                    'minutes': minutes,
                    'name': name,
                    'haircut': haircut,
                    'notes': notes
                })
            }).success(function (data) {
                console.log(data);
                $(".fa-spin").hide();
                $("." + modalNum).click();
                $scope.modalText = " - הזמנתך אושרה";
                $scope.data = data;
            });
        }
    }

    $scope.init = function () {
        $('.datetimepicker-minutes .active').removeClass("active");
        //hours from db
        angular.element(".day").click(function () {

            // Animation for hours
            $(".datetimepicker-hours").fadeIn("slow", function () {
            });

            $timeout(function () {
                var year = angular.element('.datetimepicker-hours .switch').html().split(" ")[2];
                var month = angular.element('.datetimepicker-hours .switch').html().split(" ")[1];
                var day1 = angular.element(".datetimepicker-hours .switch").html().split(" ")[0];
                var monthConvertedToInt = months.indexOf(month) + 1;
                $http({
                    url: "db.php",
                    method: "POST",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param({
                        'getCustomers': "getCustomers",
                        'year': year,
                        'month': monthConvertedToInt,
                        'day': day1
                    })
                }).success(function (data) {
                    if (data != null) {
                        console.log(data);

                        /*if (value.minutes == v.innerHTML.split(":")[1] && value.hour == time){
                         angular.element(v).addClass("hidden");
                         }*/
                        angular.forEach(data, function (value, key) {
                            angular.forEach(angular.element(".hour"), function (v, k) {
                                var time = v.innerHTML.split(":")[0];
                                if (value.hour == time)
                                    angular.element(v).removeClass('hour').addClass("hidden");
                            });
                        });
                    }
                });
            }, 100);
        });


        //remove Saturday
        $timeout(function () {
            angular.forEach(angular.element(".datetimepicker-days tr .day:last-child"), function (value, key) {
                var Saturday = angular.element(value);
                Saturday.removeClass('day').addClass("notWorkingDay");
            });
            //remove Mondays
            angular.forEach(angular.element(".datetimepicker-days tr .day:nth-child(2)"), function (value, key) {
                var Mondays = angular.element(value);
                Mondays.removeClass('day').addClass("notWorkingDay");
            });
            //Fridays click event
            angular.forEach(angular.element(".datetimepicker-days tr .day:nth-child(6)"), function (value, key) {
                var friday = angular.element(value);
                friday.click(function () {
                    $timeout(function () {
                        angular.forEach(angular.element(".datetimepicker-hours tr .hour:nth-child(n+7)"), function (value, key) {
                            var hours = angular.element(value);
                            hours.removeClass('hour').addClass("hidden");
                        });
                    }, 10);
                });
            });
        }, 500);
    }

    //click on date event
    angular.element(".switch").click(function () {
        $scope.init();
    });
    angular.element(".today").click(function () {
        $timeout(function () {
            $scope.init();
        });
    });
    angular.element(".month").click(function () {
        $scope.init();
    });
    angular.element(".prev").click(function () {
        $timeout(function () {
            $scope.init();
        });
    });
    angular.element(".next").click(function () {
        $timeout(function () {
            $scope.init();
        });
    });


});

/*
 * ********************* price Controller ****************
 */

app.controller('priceController', function ($scope) {

});
/*
 * ********************* gallery Controller ****************
 */

app.controller('galleryController', function ($scope) {
});

/*
 * ********************* coupons Controller ****************
 */

app.controller('couponsController', function ($scope) {

});
/*
 * ********************* about Controller ****************
 */

app.controller('aboutController', function ($scope) {

});
/*
 * ********************* customers Controller ****************
 */

app.controller('customersController', function ($scope, $http,$timeout) {
    var months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var day = new Date().getUTCDate() + 1;

    $scope.init = function () {
        $http({
            url: "db.php",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({
                'getCustomers': "getCustomers",
                'year': year,
                'month': month,
                'day': day - 1
            })
        }).success(function (data) {
            if (data != false) {

                data.sort(function (a, b) {
                    if (b.hour.length == 1)
                        b.hour = "0"+ b.hour;
                    if (a.hour.length == 1)
                        a.hour = "0"+ a.hour;
                    if (a.hour > b.hour) {
                        return 1;
                    }
                    if (a.hour < b.hour) {
                        return -1;
                    }
                    // a must be equal to b
                    return 0;
                });
                $scope.customers = data;
                $scope.date = data[0].day + "-" + data[0]['converted_month'] + "-" + data[0].year;
                console.log(data);
            }
            else {
                $scope.date = (day - 1) + "-" + month + "-" + year;
            }
        });
    }

    $scope.changeDay = function (lastOrNext) {
        if (lastOrNext == 'last') {
            day -= 1;
            if (day == 0) {
                month -= 1;
                day = new Date(year, month, 0).getDate();
            }
            if (month == 0) {
                month = 12;
                year -= 1;
            }
        }
        else if (lastOrNext == 'next') {
            day += 1;
            var days = new Date(year, month, 0).getDate();
            if (day == days) {
                day = 1;
                month += 1;
            }
            if (month == 13) {
                month = 1;
                year += 1;
            }
        }
        else {
            year = new Date().getFullYear();
            month = new Date().getMonth() + 1;
            day = new Date().getUTCDate() + 1;
        }
        $http({
            url: "db.php",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({
                'getCustomers': "getCustomers",
                'year': year,
                'month': month,
                'day': day - 1
            })
        }).success(function (data) {
            if ($.trim(data) != "") {
                $scope.customers = data;
                console.log(data);
                $scope.date = data[0].day + "-" + data[0]['converted_month'] + "-" + data[0].year;
            }
            else {
                $scope.customers = '';
                var tempEmptyData = [];
                // tempEmptyData.push({"day": day - 1, "month": month, "year": year});
                $scope.customers = tempEmptyData;
                $scope.date = (day - 1) + "-" + month + "-" + year;
            }
        });
    }
    $scope.cancelOrder = function (ID) {
        $http({
            url: "db.php",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({
                'cancelOrder': "cancelOrder",
                'ID': ID
            })
        }).success(function (data) {
            $scope.customers = $scope.customers.filter(function (x) {
                return x.ID !== ID;
            });
        })
    }
});


/*
 * ********************* JS  ****************
 */
$(document).ready(function () {

    var sideslider = $('[data-toggle=collapse-side]');
    var sel = sideslider.attr('data-target');
    var sel2 = sideslider.attr('data-target-2');
    sideslider.click(function (event) {
        $(sel).toggleClass('in');
        $(sel2).toggleClass('out');
    });

    $("nav a").mouseenter(function () {
        $("audio")[0].play();
    });

});


/*
 * ********************* Directives  ****************
 */
