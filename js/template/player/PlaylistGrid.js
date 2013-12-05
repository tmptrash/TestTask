/**
 * Template of the playlist grid.
 *
 * @author DeadbraiN
 */
N13.define('App.template.player.PlaylistGrid', {
    statics: {
        data: '' +
            '<table class="playlist-grid">' +
                '<% var i, len, url, index, rating; %>' +
                '<% for(i = 0, len = tracks.length; i < len; i++) { %>' +
                    '<% url = tracks[i].url; %>' +
                    '<% index = url.lastIndexOf("/"); %>' +
                    '<% rating = tracks[i].rating; %>' +
                    '<tr row="<%= i %>">' +
                        '<td col="0"><%= index !== -1 && index !== url.length - 1 ? url.substr(url.lastIndexOf("/") + 1) : url %></td>' +
                        '<td col="1">' +
                            '<div class="rating"' + ' data-rating-max="<%= maxRating %>" data-val="<%= rating %>">' +
                            '</div>' +
                        '</td>' +
                        '<td col="2" align="center">X</td>' +
                    '</tr>' +
                '<% } %>' +
            '</table>'
    }
});