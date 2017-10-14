var genre = 'All';
var pageNumber = 1;

// next/prev
// if pageNumber > 1 = > pagenumber - 1 and recall photospage();
$(document).ready(function () {
    var btnGenre = $('.btnGenre');
    for (var i = 0; i < btnGenre.length; i++) {
        $(btnGenre[i]).click(function () {
            pageNumber = 1;
            $('button:contains(' + genre + ')').removeClass('btnHover');
            genre = $(this).text();
            $(this).addClass('btnHover');
            photosPage();
        })
    }
    photosPage();

    //END
});

function photosPage() {
    $.ajax({
        url: './webApi/getPhotos.php?name=' + genre + '&page=' + pageNumber,
        data: {
            format: 'json'
        },
        error: function () {
            alert('An error has occurred');
        },
        success: function (data) {
            var result = JSON.parse(data);
            $('#photos').empty();
            for (var i = 0; i < result.photos.length; i++) {
                var imgSrc = './photos/' + result.photos[i].name;
                $('#photos').append('<img src="' + imgSrc + '" alt="' + result.photos[i].name + '" class="col-md-4 col-sm-6 col-xs-12 img">');
            }
            $('#pagesBtn').empty();
            if (result.totalNumPages > 1) {
                if (result.totalNumPages < 5) {

                    for (var i = 0; i < result.totalNumPages; i++) {
                        var btn = $('<button class="paginationBtn">' + (i + 1) + '</button>');
                        $('#pagesBtn').append(btn);
                        btn.click(function () {
                            pageNumber = parseInt($(this).text());
                            photosPage();
                        });
                    }
                } else {
                    if (pageNumber < 3) {
                        for (var i = 1; i <= 3; i++) {
                            var btn = $('<button class="paginationBtn">' + i + '</button>');
                            $('#pagesBtn').append(btn);
                            btn.click(function () {
                                pageNumber = parseInt($(this).text());
                                photosPage();
                            });
                        }

                        $('#pagesBtn').append('<button class="paginationBtn">...</button>');

                    } else if (pageNumber < result.totalNumPages - 2) {
                        $('#pagesBtn').prepend('<button class="paginationBtn">...</button>');
                        for (var i = pageNumber -1; i <= pageNumber + 1; i++) {
                            var btn = $('<button class="paginationBtn">' + i + '</button>');
                            $('#pagesBtn').append(btn);
                            btn.click(function () {
                                pageNumber = parseInt($(this).text());
                                photosPage();
                            });
                        }
                        $('#pagesBtn').append('<button class="paginationBtn">...</button>');
                    } else {
                        $('#pagesBtn').prepend('<button class="paginationBtn">...</button>');
                        for (var i = result.totalNumPages - 2; i <= result.totalNumPages; i++) {
                            var btn = $('<button class="paginationBtn">' + i + '</button>');
                            $('#pagesBtn').append(btn);
                            btn.click(function () {
                                pageNumber = parseInt($(this).text());
                                photosPage();
                            });
                        }
                    }
                }
                $('button:contains(' + pageNumber + ')').addClass('btnHover');
                $('#pagesBtn').prepend('<button id="paginationBtnPrev">Prev</button>');
                $('#pagesBtn').append('<button id="paginationBtnNext">Next</button>');
                $('#paginationBtnPrev').click(function () {
                    if (pageNumber > 1) {
                        pageNumber--;
                        photosPage();
                    }
                });
                $('#paginationBtnNext').click(function () {
                    if (pageNumber < result.totalNumPages) {
                        pageNumber++;
                        photosPage();
                    }
                });
            }
        },
        type: 'GET'
    });
}


