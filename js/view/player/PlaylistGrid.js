/**
 * Playlist grid. contains a list of URLs of tracks to play
 *
 * Available events:
 * selected Fires then one row in grid is selected
 *
 * @author DeadbraiN
 */
N13.define('App.view.player.PlaylistGrid', {
    extend : 'App.view.base.View',
    requires: [
        'App.template.player.PlaylistGrid',
        'App.Config'
    ],
    configs : {
        /**
         * {String|Boolean} Name of the template class for current view or false if current class doesn't use template
         */
        template: 'player.PlaylistGrid',
        /**
         * {String} Name of the collection, which contains tracks for playlist
         */
        tracks : null
    },


    /**
     * Private fields creator and initializer
     */
    initPrivates: function () {
        this.callParent();

        /**
         * {Element|null} Current(selected) row
         * @private
         */
        this._curRowEl = null;
        /**
         * {Number} Current(selected) row index
         * @private
         */
        this._curRow = null;
        /**
         * {Number} Max rating of tracks
         * @private
         */
        this._maxRating = App.Config.player.maxRating;
        /**
         * {Boolean} Sequence of playing racks collection
         * @private
         */
        this._sequencePlayingTracks = false;
    },

    /**
     * Calls before render() method for pre render actions.
     * It sets a tracks collection to the template.
     */
    onBeforeRender: function () {
        this.callParent();

        if (!this.tracks) {
            console.log('Tracks collection wasn\'t set for playlist');
            return;
        }

        this.setConfig({
            data: {
                tracks   : this.tracks.toJSON(),
                maxRating: this._maxRating
            }
        });
    },

    /**
     * Calls after render() method for post render actions. It binds click event
     * handlers to the table rows. Run rating for tracks and show rating of default tracks.
     */
    onAfterRender: function () {
        var me = this;

        // Run rating library
        $('.rating').starRating({
            minus: false // step minus button
        });

        // Show rating of default tracks
        $('div.rating').each(function () {
            //search track rating attribute of current track
            var trackRating = $(this).attr('data-val');
            //click emulation for display rating
            if (trackRating > 0) {
                $(this).find('li').get(trackRating - 1).click();
            }
        });

        if (this.tracks) {
            this.tracks.off('add', this._onChange);
            this.tracks.off('remove', this._onChange);
            this.tracks.off('change', this._onChange);

            this.tracks.listen(this.tracks, 'add', this._onChange, this);
            this.tracks.listen(this.tracks, 'remove', this._onChange, this);
            this.tracks.listen(this.tracks, 'change', this._onChange, this);
        }

        if ($.isNumeric(this._curRow)) {
            this.select(this._curRow);
        }

        this.el.find('tr').off().on('click', function () {me._onRowClick.apply(me, arguments);});

        this.callParent();
    },

    /**
     * Rerender this view
     * @private
     */
    _onChange: function () {
        this.render();
    },

    /**
     * Selects specified track by it's row index
     * @param {Number|Boolean} row Row index
     */
    select: function (row) {
        $('.playlist-grid tr[row="' + ($.isNumeric(row) ? row : this._curRow + 1) + '"] td[col="0"]').click();
    },

    /**
     * Table row and rating click event handler. Adds selection css style to the clicked row,
     * and adds new rating to models of tracks if clicked on rating column
     * @param {Event} e Event object
     * @private
     */
    _onRowClick: function (e) {
        var me = this;
        var col;

        if (this._curRowEl) {
            this._curRowEl.removeClass('selected');
        }
        this._curRowEl = $(e.currentTarget);
        this._curRow = +this._curRowEl.attr('row');
        if (e.target.nodeName.toUpperCase() === 'TD') {
            col = +$(e.target).attr('col');

            if (col === 0) {
                this._curRowEl.addClass('selected');
                this.trigger('selected', this.tracks.at(this._curRow));
            } else if (col === 1) {
                this._curRowEl.addClass('selected');
            } else if (col === 2) {
                this._curRowEl = null;
                //this.tracks.changeSum(-this.tracks.at(this._curRow).get('rating'));
                this.tracks.remove(this.tracks.at(this._curRow));
            }
        } else if (e.target.nodeName.toUpperCase() === 'LI') {
            var oldRating = this.tracks.at(this._curRow).get('rating');
            var newRating = $(e.target).index() + 1;
            this.tracks.at(this._curRow).set({rating: newRating});
            //this.tracks.changeSum(newRating - oldRating);
        }
    },

    /**
     * 'played' event handler. Play next track in the playlist
     * @public
     */
    onTrackPlayed: function () {
        var me = this;
        if (me._sequencePlayingTracks) {
            var accumulateSum = 0;
            var totalSum = me.tracks.getSum();
            var randomSum = Math.floor((Math.random() * totalSum) + 1);
            $('table.playlist-grid tr').each(function () {
                accumulateSum = accumulateSum + +$(this).find('div.rating').attr('data-val');
                if (accumulateSum >= randomSum) {
                    me.select($(this).attr('row'));
                    return false;
                }
            });
        } else {
            me.select(true);
        }
    },

    /**
     * Rating button click handler. Toggle of sequence of playing tracks
     * @public
     */
    onChangeSequencePlayTracksClick: function () {
        this._sequencePlayingTracks = !this._sequencePlayingTracks;
    }
});