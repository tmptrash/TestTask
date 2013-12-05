/**
 * Button abstraction
 *
 * Available events:
 *
 * click Fires then user clicks on button
 *
 * @author DeadbraiN
 */
N13.define('App.view.player.RatingButton', {
    extend : 'App.view.Button',
    configs: {
        title   : 'Rating',
        btnClass: 'toggle-button'
    },

    /**
     * Calls after render() method. Here all DOM model have already
     * rendered and we may bind event handlers to them.
     */
    onAfterRender: function () {
        this.callParent();
        this.listen(this, 'click', function () {
            this.el.find('.' + this.btnClass).toggleClass('rating-on');
        });
    }
});