$(document).ready(function() {

    //	$('#doact').on('click', dosayhi);
    $('#et').on('click', mobile01_topiclist);
    $('#et2').on('click', topicdetail);
    // $('#et3').on('click', etnews);
});

var serverBaseUrl = "http://" + location.host;

//function dosayhi() {
//	var name = $("#name").val();
//	// var fb_pid = $("#fb_pid").val();
//	$.ajax({
//		url : serverBaseUrl + '/do_sayhi',
//		// async: false,
//		type : 'POST',
//		dataType : "json",
//		data : {
//			name : name
//		},
//		success : function(smsg) {
//			if (smsg.message) {
//				var docs = smsg.data;
//				var name = docs.name;
//				var dt = docs.dt;
//				$("#output").html(dt + " : " + name + " say hi");
//			}
//		},
//		error : function(jqXHR, textStatus, errorThrown) {
//			console.log(jqXHR);
//			console.log('jqXHR=', jqXHR.status);
//			console.log('textStatus=', textStatus);
//			console.log('cerrorThrown=', errorThrown);
//		}
//	});
//}

function mobile01_topiclist() {
    var name = $("#name").val();
    $.ajax({
        url: serverBaseUrl + '/do_parser_mobile01',
        async: true,
        type: 'POST',
        dataType: "json",
        data: {
            name: name
        },
        success: function(smsg) { //接et_parser.js的res.json(200,
            if (smsg.message) {
                var docs = smsg.dt;
                var newss = smsg.p_html;
                for (var i = 0; i < newss.length; i++) {
                    var str = "<p>Date: " + newss[i].dt + "</p>";
                    str += "<p>主題: " + newss[i].desc + "</p>";
                    str += "<p>Href: " + newss[i].href + "</p>";
                    str += "<p>發文作者: " + newss[i].authur + "</p>";
                    str += "<hr>";
                    $("#output").append(str);
                }
                console.log("ddddd");
                // var name = smsg.p_html;
                // var dt = smsg.dt;
                // $("#output").html(dt + " : " +JSON.stringify(name) + " say
                // hi");
                // console.log(name);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log('jqXHR=', jqXHR.status);
            console.log('textStatus=', textStatus);
            console.log('cerrorThrown=', errorThrown);
        }
    });

}

function topicdetail() {
    var name = $("#name").val();
    $.ajax({
        url: serverBaseUrl + '/do_parser_topicdetail',
        // async: false,
        type: 'POST',
        dataType: "json",
        data: {
            name: name
        },
        success: function(smsg) {
            // if (smsg.message) {
            //     var name = smsg.p_html;
            //     var dt = smsg.dt;
            //     $("#output2").html(dt + " : " + JSON.stringify(name));
            //     console.log(name);
            // }
            if (smsg.message) {
                var docs = smsg.dt;
                var newss = smsg.p_html;
                for (var i = 0; i < newss.length; i++) {
                    var str = "<p>留言者: " + newss[i].Reply_user + "</p>";
                    str += "<p>留言內容: " + newss[i].Reply_content + "</p>";
                    str += "<p>Href: " + newss[i].href + "</p>";
                    str += "<p>發文作者: " + newss[i].authur + "</p>";
                    str += "<hr>";
                    $("#output2").append(str);
                }
                console.log("ddddd");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log('jqXHR=', jqXHR.status);
            console.log('textStatus=', textStatus);
            console.log('cerrorThrown=', errorThrown);
        }
    });
}

// function etnews() {
//     var name = $("#name").val();
//     // var fb_pid = $("#fb_pid").val();
//     $.ajax({
//         url: serverBaseUrl + '/do_parser_et_news',
//         // async: false,
//         type: 'POST',
//         dataType: "json",
//         data: {
//             name: name
//         },
//         success: function(smsg) { //接et_parser.js的res.json(200,
//             if (smsg.message) {
//                 var docs = smsg.dt;
//                 var newss = smsg.tot;
//                 for (var i = 0; i < newss.length; i++) {
//                     var str = "<p>Date: " + newss[i].dt + "</p>";
//                     str += "<p>desc: " + newss[i].desc + "</p>";
//                     str += "<p>Href: " + newss[i].href + "</p>";
//                     str += "<p>Type: " + newss[i].type + "</p>";
//                     str += "<hr>";
//                     $("#output3").append(str);
//                 }
//                 console.log(newss);
//                 // var name = smsg.p_html;
//                 // var dt = smsg.dt;
//                 // $("#output").html(dt + " : " +JSON.stringify(name) + " say
//                 // hi");
//                 // console.log(name);
//             }
//         },
//         error: function(jqXHR, textStatus, errorThrown) {
//             console.log(jqXHR);
//             console.log('jqXHR=', jqXHR.status);
//             console.log('textStatus=', textStatus);
//             console.log('cerrorThrown=', errorThrown);
//         }
//     });

// }