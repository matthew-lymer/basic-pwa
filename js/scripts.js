    //JS cookie control
    //E.g. Cookies.set('cookieName', 'cookieValue', { expires: 7, secure: false });
    //Where expires is in days
    //!function(e){if("function"==typeof define&&define.amd)define(e);else if("object"==typeof exports)module.exports=e();else{var n=window.Cookies,t=window.Cookies=e();t.noConflict=function(){return window.Cookies=n,t}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(t){function o(n,r,i){var c;if(arguments.length>1){if(i=e({path:"/"},o.defaults,i),"number"==typeof i.expires){var s=new Date;s.setMilliseconds(s.getMilliseconds()+864e5*i.expires),i.expires=s}try{c=JSON.stringify(r),/^[\{\[]/.test(c)&&(r=c)}catch(a){}return r=t.write?t.write(r,n):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)),n=n.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),n=n.replace(/[\(\)]/g,escape),document.cookie=[n,"=",r,i.expires&&"; expires="+i.expires.toUTCString(),i.path&&"; path="+i.path,i.domain&&"; domain="+i.domain,i.secure?"; secure":""].join("")}n||(c={});for(var p=document.cookie?document.cookie.split("; "):[],d=/(%[0-9A-Z]{2})+/g,u=0;u<p.length;u++){var f=p[u].split("="),l=f[0].replace(d,decodeURIComponent),m=f.slice(1).join("=");'"'===m.charAt(0)&&(m=m.slice(1,-1));try{if(m=t.read?t.read(m,l):t(m,l)||m.replace(d,decodeURIComponent),this.json)try{m=JSON.parse(m)}catch(a){}if(n===l){c=m;break}n||(c[l]=m)}catch(a){}}return c}return o.get=o.set=o,o.getJSON=function(){return o.apply({json:!0},[].slice.call(arguments))},o.defaults={},o.remove=function(n,t){o(n,"",e(t,{expires:-1}))},o.withConverter=n,o}return n(function(){})});

    import { openDB, deleteDB, wrap, unwrap } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

    async function createDB() {
      // Using https://github.com/jakearchibald/idb
      const db = await openDB('cookbook', 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
          // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.
        switch(oldVersion) {
         case 0:
           // Placeholder to execute when database is created (oldVersion is 0)
         case 1:
           // Create a store of objects
           const store = db.createObjectStore('recipes', {
             // The `id` property of the object will be the key, and be incremented automatically
               autoIncrement: true,
               keyPath: 'id'
           });
           // Create an index called `name` based on the `type` property of objects in the store
           store.createIndex('type', 'type');
         }
       }
      });
    }

    async function storeLocalData() {
        const ketoCookies = {
            rows: []
        };

        $(".list-item").each(function(){
            var id,des,cal,car;
            id = parseInt($(this).attr("data-row")) - 1;
            des = $(this).find("input[name='description']").val();
            cal = $(this).find("input[name='calories']").val();
            car = $(this).find("input[name='carbs']").val();

            ketoCookies.row[id] = [des,cal,car];
        });
        const tx = await db.transaction('ketoCookies', 'readwrite');
        const ketoCookiesStore = tx.objectStore('ketoCookies');
        ketoCookiesStore.add(ketoCookies);
        await tx.done;
    }

    async function getLocalData() {
        const tx = await db.transaction('ketoCookies', 'readonly')
        const ketoCookiesStore = tx.objectStore('ketoCookies');
        // Because in our case the `id` is the key, we would
        // have to know in advance the value of the id to
        // retrieve the record
        const rows = await ketoCookiesStore.get(["rows"]);

        console.log(rows);
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

        //Add extra list items
        //Adjust the adding buttons after adding first item
        if($(".window .body #content .list-items").length){
            $(".window .body #content").on("click touch", ".empty-list-item, .add-list-item", function(){
                if($(".window .body #content .add-list-item").hasClass("suspend")){
                    alert("A maximum of 10 items can be added at a time");
                }
                else{
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
                }
            });
        }

        //Remove existing list-items
        //Reset the adding buttons if no items left
        //Adjust the calorie total after removing a list-item
        $(".window .body #content .list-items").on("click touch", ".list-item a.close", function(){
            $(this).parent(".list-item").remove();
            totalCalories();
        });

        $(".window .body #content .list-items").on("change keyup", ".list-item input.calories,.list-item input.carbs", function(){
            totalCalories();
            storeLocalData();
        });
    });
