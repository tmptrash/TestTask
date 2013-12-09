N13.define('App.collection.player.Track', {
    extend  : 'Backbone.Collection',
    requires: [
        'App.model.player.Track',
        'App.Config'
    ],
    /**
     * @constructor
     * Initializes model of current collection. We should do it
     * here because of model dependency issue.
     */
    init: function () {
        var me = this;
        this.model = App.model.player.Track;
        this.callParent(arguments);
        this.url = App.Config.player.tracksCollectionUrl;

        this.on('add', this._calculateSum, this);
        this.on('change', this._calculateSum, this);
        this.on('remove', this._calculateSum, this);

        this.fetch({
            async  : false, //Wait when collection fetched
            error  : function () {
                console.log("Can't fetch tracks from " + me.url);
            }
        });
    },

    /**
     * Private fields creator and initializer
     */
    initPrivates: function () {
        this.callParent();
        /**
         * {Number} Sum of rating of collection tracks.
         * @private
         */
        this._sum = 0;
    },

    /**
     * @changeSum
     * ATTENTION! I do not use now this function
     * Setter for this._sum
     * Change sum of rating current collection
     * Argument "value" can be <=> 0
     */
    changeSum: function(value) {
        if (typeof(value) !== "number") {
            throw new Error("Value must be a number!");
        } else if (this._sum + value < 0) {
            throw new Error("Sum can not be less than zero!");
        } else {
            this._sum = this._sum + value;
        }
        return this._sum;
    },

    /**
     * @getSum
     * Getter for this._sum
     * Get sum of rating current collection
     */
    getSum: function () {
        return this._sum;
    },

    /**
     * @calculateSum
     * Calculate sum of rating all tracks of this collection
     * @private
     */
    _calculateSum: function () {
        this._sum = 0;
        for (var i = 0; i < this.models.length; i++)
            this._sum = this._sum + this.models[i].get('rating');
        return this._sum;
    }
});