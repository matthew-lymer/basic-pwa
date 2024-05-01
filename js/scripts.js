    //JS cookie control
    //E.g. Cookies.set('cookieName', 'cookieValue', { expires: 7, secure: false });
    //Where expires is in days
    !function(e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof exports)module.exports=e();else{var n=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=n,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(t){function o(n,r,i){var c;if(arguments.length>1){if(i=e({path:"/"},o.defaults,i),"number"==typeof i.expires){var s=new Date;s.setMilliseconds(s.getMilliseconds()+864e5*i.expires),i.expires=s}try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(a){}return r=t.write?t.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",r,i.expires&&"; expires="+i.expires.toUTCString(),i.path&&"; path="+i.path,i.domain&&"; domain="+i.domain,i.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var f=p[u].split("="),l=f[0].replace(d,decodeURIComponent),m=f.slice(1).join("=");'"'===m.charAt(0)&&(m=m.slice(1,-1));try{if(m=t.read?t.read(m,l):t(m,l)||m.replace(d,decodeURIComponent),this.json)try{m=JSON.parse(m)}catch(a){}if(n===l){c=m;break}n||(c[l]=m)}catch(a){}}return c}return o.get=o.set=o,o.getJSON=function(){return o.apply({json:!0},[].slice.call(arguments))},o.defaults={},o.remove=function(n,t){o(n,"",e(t,{expires:-1}))},o.withConverter=n,o}return n(function(){})});

    function storeLocalData() {
        var ketoCookie = [];
        var ketoCookieJSON;

        $(".list-item").each(function(){
            var id,des,cal,car;
            id = parseInt($(this).attr("data-row")) - 1;
            des = $(this).find("input[name='description']").val();
            cal = $(this).find("input[name='calories']").val();
            car = $(this).find("input[name='carbs']").val();

            ketoCookie[id] = [des,cal,car];
        });

        ketoCookieJSON = JSON.stringify(ketoCookie);
        Cookies.set('ketoCookie', ketoCookie, { expires: 2, secure: false });
    }

    function getLocalData() {
        var ketoCookieJSON = JSON.parse(Cookies.get('ketoCookie'));
        console.log(ketoCookieJSON);

        Object.keys(ketoCookieJSON).forEach(key => {
            $(".list-item[data-row='"+key+"'] input[name='description']").val(ketoCookieJSON[key][0]);
            $(".list-item[data-row='"+key+"'] input[name='calories']").val(ketoCookieJSON[key][0]);
            $(".list-item[data-row='"+key+"'] input[name='carbs']").val(ketoCookieJSON[key][0]);
            $(".window .body #content .add-list-item").trigger("click");
        });
    }

    function totalCalories(){
        var calories = 0;
        var carbs = 0;

        $(".window .body #content .list-item input.calories").each(function(){
            var calorie = parseFloat($(this).val());
            if(isNaN(calorie)){
                calorie = 0;
            }

            calories += calorie;
        });

        $(".window .body #content .list-item input.carbs").each(function(){
            var carb = parseFloat($(this).val());
            if(isNaN(carb)){
                carb = 0;
            }

            carbs += carb;
        });

        $(".window .body #calorie-total .total").text(Math.ceil(calories).toLocaleString('en'));
        $(".window .body #calorie-total .totalS").text((Math.ceil(carbs*10)/10).toLocaleString('en'));
    }

    $(document).ready(function(){
        getLocalData();

        $(".window .body #content").on("click touch", ".empty-list-item, .add-list-item", function(){
            var next = $(".list-item").length + 1;

            var listItemHTML = '<div class="list-item" data-row="'+next+'">' +
                                '    <a class="close button left">' +
                                '        <img src="images/close-white.svg" alt="Delete" width="30" height="30" />' +
                                '    </a>' +
                                '    <input class="food description left" type="text" name="description" value="" placeholder="Food" />' +
                                '    <input class="food calories left" type="tel" name="calories" value="" placeholder="kCal" />' +
                                '    <input class="food carbs left" type="number" name="carbs" value="" placeholder="grams" />' +
                                '    <div class="clear"></div>' +
                                '</div>';

            $(".window .body #content .list-items").append(listItemHTML);

            $(".window .body #content .overflow-box").stop().animate({ scrollTop: $('.window .body #content .overflow-box').prop("scrollHeight")}, 500);

            // var listItemCount = $(".window .body #content .list-items .list-item").length;

            // if(listItemCount > 1){
            //     $(".window .body #content .empty-list-item").removeClass("on");
            // }
            //
            // if(listItemCount >= 50){
            //     $(".window .body #content .add-list-item").addClass("suspend");
            // }
            // else{
            //     $(".window .body #content .add-list-item").removeClass("suspend");
            // }
        });

        //Remove existing list-items
        //Reset the adding buttons if no items left
        //Adjust the calorie total after removing a list-item
        $(".window .body #content .list-items").on("click touch", ".list-item a.close", function(){
            $(this).parent(".list-item").remove();
            totalCalories();
            storeLocalData();
        });

        $(".window .body #content .list-items").on("change keyup", ".list-item input", function(){
            totalCalories();
            storeLocalData();
        });
    });
