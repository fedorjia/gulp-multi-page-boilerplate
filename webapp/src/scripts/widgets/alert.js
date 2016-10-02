/**
 * 公用的弹出层提示 alert
 */
var Alert = {

    /***
     * options:
     *     content:
     *           说明: 正文
     *           default: ''
     *     buttonText:
     *          说明: 按钮文字
     *          default: 确定
     *     showIcon:
     *          说明: 显示图标
     *          default: true
     *     callback:
     *          说明: 回调
     *          default: null
     */

    options: {
        buttonText: '确定',
        showIcon: true
    },

    /**
     * success alert
     */
    success: function(title, options) {
        this.alert(title, 'success', options);
    },

    /**
     * warning alert
     */
    warning: function(title, options) {
        this.alert(title, 'warning', options);
    },

    /**
     * error alert
     */
    error: function(title, options) {
        this.alert(title, 'error', options);
    },

    /**
     * alert
     */
    alert: function (title, tag, options) {
        options = options || {};
        options.title = title;
        for(var option in this.options) {
            if(this.options.hasOwnProperty(option)) {
                if(options[option] === undefined) {
                    options[option] = this.options[option];
                }
            }
        }

        // dismiss
        this.dismissWithoutAnim();

        // create element
        this.$el = this.__createEl(tag, options);
        // show
        this.__show();
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

        var $modal = $('.alert-modal');
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
        $('.alert-modal').remove();
    },

    __show: function() {
        $('html').css('overflow-y', 'hidden');
        
        // show with animation
        var fixTop = (-(this.$el.modal.height()/1.36) + $('body').scrollTop());
        this.$el.modal.css('margin-top', fixTop);
        this.$el.overlay.height($(document).height());
        
        this.$el.modal.velocity('transition.slideDownIn', 280);
        this.$el.overlay.velocity({ opacity: 0.4 }, { duration: 280 });
    },

    /**
     * create element
     */
    __createEl: function(tag, options) {
        var $body = $('body');
        // create overlay
        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        $body.append(overlay);

        // create alert modal
        var modal = document.createElement('div');
        modal.className = 'alert-modal';
        $body.append(modal);

        // make html element
        var $modal = $(modal);
        var $overlay = $(overlay);

        var icon = '';
        if(options.showIcon) {
            if(tag === 'success') {
                icon = '<div class="sa-icon sa-success animate">'+
                            '<span class="sa-line sa-tip animateSuccessTip"/>'+
                            '<span class="sa-line sa-long animateSuccessLong"/>'+
                            '<div class="sa-placeholder"></div>'+
                            '<div class="sa-fix"></div>'+
                       '</div>';
            } else if(tag === 'warning') {
                icon = '<img class="icon" src="/images/err.png"/>';
            } else if(tag === 'error') {
                icon = '<img class="icon" src="/images/err.png"/>';
            }
        }

        $modal.append([
            '<h1 class="title">', options.title ,'</h1>',
            icon,
            '<div class="content">', (options.content || '') , '</div>',
            '<div class="btn btn-blue">', (options.buttonText || '确定') , '</div>'
        ].join(''));

        this.__bindEvents(options);

        return {
            modal: $modal,
            overlay: $overlay
        }
    },

    __bindEvents: function(options) {
        // btn click event
        var self = this;
        $('.alert-modal .btn').on('click', function() {
            if(options.callback) {
                options.callback();
            }
            self.dismiss();
        });
    }
};