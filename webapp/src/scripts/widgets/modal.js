/**
 * 公用的弹出层提示 modal
 */

/***
 * options:
 *      title:
 *           说明: 标题
 *           default: ''
 *     content:
 *           说明: 内容
 *           default: ''
 */

var Modal = function(options) {
    options = options || {};
    // dismiss
    this.dismissWithoutAnim();

    // create element
    this.$el = this.__createEl(options);
};

Modal.prototype = {
    show: function(callback) {
        $('html').css('overflow-y', 'hidden');

        // show with animation
        var fixTop = -(this.$el.modal.height()/1.36) + $('body').scrollTop();
        this.$el.modal.css('margin-top', fixTop);
        this.$el.overlay.height($(document).height());
        
        this.$el.modal.velocity('transition.slideDownIn', 280);
        this.$el.overlay.velocity({ opacity: 0.4 }, {
            duration: 280,
            complete: function() {
                if(callback) {
                    callback();
                }
            }
        });
    },

    /**
     * dismiss
     */
    dismiss: function() {
        $('html').css('overflow-y', 'auto');

        var $overlay = $('.modal-overlay');
        if($overlay.length > 0) {
            $overlay.velocity('fadeOut', {
                duration: 280,
                complete: function() {
                    $overlay.remove();
                }
            });
        }

        var $modal = $('.popup-modal');
        if($modal.length > 0) {
            $modal.velocity('transition.slideDownOut', {
                duration: 280,
                complete: function() {
                    $modal.remove();
                }
            });
        }
    },

    /**
     * dismiss without animation
     */
    dismissWithoutAnim: function() {
        $('.modal-overlay').remove();
        $('.popup-modal').remove();
    },

    /**
     * create element
     */
    __createEl: function(options) {
        var $body = $('body');
        // create overlay
        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        $body.append(overlay);

        // create alert modal
        var modal = document.createElement('div');
        modal.className = 'popup-modal';
        $body.append(modal);

        // make html element
        var $modal = $(modal);
        var $overlay = $(overlay);


        $modal.append([
            '<h1 class="title">', options.title ,'</h1>',
            (options.content || '')
        ].join(''));

        return {
            modal: $modal,
            overlay: $overlay
        }
    }
};