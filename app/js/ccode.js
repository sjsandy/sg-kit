/**
 * Created by studio-mac on 6/18/14.
 */
/**
 * Created by shawnsandy on 6/18/14.
 *
 *
 *
 *
 */

(function(){


    var $button = $("<div id='source-button' class='btn btn-primary btn-xs'>&lt; &gt;</div>").click(function(){
        var html = $(this).parent().html();
        html = cleanSource(html);
        $("#source-modal pre").text(html);
        $("#source-modal").modal();
    });


    $(".ccode").click(function(){
        var src = $(this).data('src');
        var html = $(this).parent().html();

        html = cleanSource(html);

        if(src){
            $("#source-modal pre").load(src);
        } else {
            $("#source-modal pre").text(html);
        }
        $("#source-modal").modal();
        console.log('clicked');

    });





    $('.bs-component [data-toggle="popover"]').popover();
    $('.bs-component [data-toggle="tooltip"]').tooltip();

    $(".bs-component").hover(function(){
        $(this).append($button);
        $button.show();
    }, function(){
        $button.hide();
    });

    function cleanSource(html) {
        var lines = html.split(/\n/);

        lines.shift();
        lines.splice(-1, 1);

        var indentSize = lines[0].length - lines[0].trim().length,
            re = new RegExp(" {" + indentSize + "}");

        lines = lines.map(function(line){
            if (line.match(re)) {
                line = line.substring(indentSize);
            }

            return line;
        });

        lines = lines.join("\n");

        return lines;
    }

})();
