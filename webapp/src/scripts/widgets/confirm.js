/**
 * 公用的弹出层提示 confirm
 */
var Confirm = {
    /***
     * options:
     *     content:
     *           说明: 正文
     *           default: ''
     *     cancelButtonText:
     *          说明: 按钮文字
     *          default: 取消
     *     confirmButtonText:
     *          说明: 按钮文字
     *          default: 确定
     *     cancelButtonCls:
     *          说明: 按钮class name
     *          default: ''
     *     confirmButtonCls:
     *          说明: 按钮class name
     *          default: 'btn-blue'
     *     showIcon:
     *          说明: 显示图标
     *          default: true
     *     callback:
     *          说明: 回调
     *          default: null
     */

    options: {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        cancelButtonCls: 'btn-white',
        confirmButtonCls: 'btn-blue',
        showIcon: true
    },

    /**
     * confirm
     */
    show: function (title, options) {
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
        this.$el = this.__createEl(options);

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

        var $modal = $('.confirm-modal');
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
        $('.confirm-modal').remove();
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
    __createEl: function(options) {
        var $body = $('body');
        // create overlay
        var overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        $body.append(overlay);

        // create alert modal
        var modal = document.createElement('div');
        modal.className = 'confirm-modal';
        $body.append(modal);

        // make html element
        var $modal = $(modal);
        var $overlay = $(overlay);

        var icon = '';
        if(options.showIcon) {
            // icon =  '<div class="p1 iconfont icon-question"></div>';
            icon = [
                '<div class="content">',
                    '<img src="/images/warning.png" height="160" />',
                '</div>'
            ].join('');
        }
        $modal.append([
            '<h1 class="title">', options.title ,'</h1>',
            icon,
            '<div class="content">', (options.content || '') , '</div>',
            '<div>',
                '<div class="btn btn-cancel ' + options.cancelButtonCls + '">', (options.cancelButtonText || '取消') , '</div>',
                '<div class="btn btn-confirm ' + options.confirmButtonCls + '">', (options.confirmButtonText || '确定') , '</div>',
            '</div>'
        ].join(''));

        this.__bindEvents(options);

        return {
            modal: $modal,
            overlay: $overlay
        }
    },

    __bindEvents: function(options) {
        var self = this;
        // btn click event
        $('.confirm-modal .btn-cancel').on('click', function() {
            self.dismiss();
        });

        $('.confirm-modal .btn-confirm').on('click', function() {
            if(options.callback) {
                options.callback();
            }
            self.dismiss();
        });
    }
};