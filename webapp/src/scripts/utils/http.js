/**
 * 公用的HTTP 方法: POST, GET, PUT, DELETE
 */
var http = {

    post: function(url, params, success, failure) {
        this._do('POST', url, params, success, failure);
    },

    get: function(url, params, success, failure) {
        this._do('GET', url, params, success, failure);
    },

    put: function(url, params, success, failure) {
        this._do('PUT', url, params, success, failure);
    },

    del: function(url, params, success, failure) {
        this._do('DELETE', url, params, success, failure);
    },

    _do: function(method, url, params, success, failure) {
        $.ajax({
            url: url,
            type: method,
            dataType: 'json',
            data: params,
            cache: false,
            error: function(error) {
                if(failure) {
                    failure(error);
                }
            },
            success: function(resp) {
                if(success) {
                    success(resp);
                }
            }
        });
    }
};