var vs;
(function (vs) {
    var tools;
    (function (tools) {
        'use strict';
        var Config = (function () {
            /** @ngInject */
            function Config($logProvider) {
                // enable log
                $logProvider.debugEnabled(true);
                // set options third-party lib
            }
            return Config;
        })();
        tools.Config = Config;
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        'use strict';
        var RunBlock = (function () {
            /** @ngInject */
            function RunBlock($log) {
                $log.debug('runBlock end');
            }
            return RunBlock;
        })();
        tools.RunBlock = RunBlock;
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../.tmp/typings/tsd.d.ts" />
/// <reference path="index.config.ts" />
/// <reference path="index.run.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        'use strict';
        angular.module('vs.tools', [])
            .config(tools.Config)
            .run(tools.RunBlock)
            .constant('config', config);
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var displayConfig;
        (function (displayConfig) {
            'use strict';
            angular.module('vs.tools.displayConfig', []);
        })(displayConfig = tools.displayConfig || (tools.displayConfig = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.displayConfig').
    /* @ngInject */
    factory('displayConfigResource', function ($http) {
    'use strict';
    var configUri = config.root + 'api/rest/display/display_config/';
    function _getListQueryString() {
        var queryString = configUri + 'list';
        queryString += '?rand=' + Math.random();
        return queryString;
    }
    function _getConfigQueryString(id) {
        var queryString = configUri + id;
        queryString += '?rand=' + Math.random();
        return queryString;
    }
    function _getDisplayConfigList() {
        return $http.get(_getListQueryString()).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _getDisplayConfig(id) {
        return $http.get(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _deleteDisplayConfig(id) {
        return $http.delete(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _saveDisplayConfig(template) {
        return $http.post(configUri, template).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        getDisplayConfigs: function () {
            return _getDisplayConfigList();
        },
        getDisplayConfig: function (id) {
            return _getDisplayConfig(id);
        },
        deleteDisplayConfig: function (id) {
            return _deleteDisplayConfig(id);
        },
        saveDisplayConfig: function (template) {
            return _saveDisplayConfig(template);
        }
    };
});

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var filters;
        (function (filters) {
            'use strict';
            angular.module('vs.tools.filters', [])
                .filter('replaceString', function () {
                return function (hayStack, oldNeedle, newNeedle) {
                    return hayStack.replace(oldNeedle, newNeedle);
                };
            });
        })(filters = tools.filters || (tools.filters = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var util;
        (function (util) {
            var Sugar = (function () {
                function Sugar(config, $http) {
                    this.config = config;
                    this.$http = $http;
                }
                Sugar.isString = function (val) {
                    return (typeof val === 'string' || val instanceof String);
                };
                Sugar.getInstance = function (config, $http) {
                    return new Sugar(config, $http);
                };
                Sugar.prototype.toMap = function (key, array) {
                    var map = {};
                    array.forEach(function (value) {
                        map[value[key]] = value;
                    });
                    return map;
                };
                Sugar.prototype.toStringMap = function (array) {
                    var map = {};
                    array.forEach(function (value) {
                        map[value] = value;
                    });
                    return map;
                };
                Sugar.prototype.pluck = function (array, name, fn) {
                    var fl = [];
                    array.forEach(function (value) {
                        if (fn && fn(value)) {
                            fl.push(value[name]);
                        }
                        else if (angular.isUndefined(fn)) {
                            fl.push(value[name]);
                        }
                    });
                    return fl;
                };
                Sugar.prototype.postForm = function (url, data) {
                    var service = this.config.root + url;
                    return this.$http({
                        method: 'POST',
                        url: service,
                        data: data,
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                };
                return Sugar;
            })();
            util.Sugar = Sugar;
        })(util = tools.util || (tools.util = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="../util/sugar.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var fields;
        (function (fields_1) {
            'use strict';
            var FieldsResource = (function () {
                /* @ngInject */
                function FieldsResource(sugar) {
                    var _this = this;
                    this.sugar = sugar;
                    this.fetch = function (fields) {
                        var fl = (fields || 'name,category,docs,disp_en');
                        return sugar.postForm('solr/fields/select', _this.getFieldsParams(fl)).then(function (res) {
                            return res.data.response.docs;
                        });
                    };
                    this.fetchHydrationStats = function (query) {
                        return _this.fetch().then(function (fields) {
                            var fl = sugar.pluck(fields, 'name', function (field) { return field.name.indexOf('_') !== 0 && field.docs > 0; });
                            return sugar.postForm('solr/v0/select?' + query, _this.getStatsParams(fl)).then(function (res) {
                                var statsFields = res.data.facet_counts.facet_fields;
                                var total = res.data.response.numFound;
                                _this.applyHydration(statsFields, fields, total);
                                return fields;
                            });
                        });
                    };
                }
                FieldsResource.prototype.getFieldsParams = function (fl) {
                    return 'q=*:*&fl=' + fl + '&rows=10000&sort=name%20asc&wt=json';
                };
                FieldsResource.prototype.getStatsParams = function (fl) {
                    return 'facet=true&facet.limit=10000&facet.mincount=100&rows=0&wt=json&facet.field=' + fl.join('&facet.field=');
                };
                FieldsResource.prototype.applyHydration = function (statsFields, fields, total) {
                    var statsField, count;
                    for (var i = 0; i < fields.length; i++) {
                        statsField = statsFields[fields[i].name];
                        if (statsField && statsField.length > 0) {
                            fields[i].id = fields[i].name;
                            count = this.getCount(statsField);
                            fields[i].hydration = count / total * 100;
                        }
                    }
                    return i;
                };
                FieldsResource.prototype.getCount = function (field) {
                    var count = 0;
                    for (var i = 1; i < field.length; i += 2) {
                        count += field[i];
                    }
                    return count;
                };
                FieldsResource.refName = 'fieldsResource';
                return FieldsResource;
            })();
            fields_1.FieldsResource = FieldsResource;
        })(fields = tools.fields || (tools.fields = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="./fields.resource.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var fields;
        (function (fields) {
            'use strict';
            angular.module('vs.tools.fields', ['vs.tools.util'])
                .service(fields.FieldsResource.refName, fields.FieldsResource);
        })(fields = tools.fields || (tools.fields = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var pageConfig;
        (function (pageConfig) {
            'use strict';
            angular.module('vs.tools.pageConfig', []);
        })(pageConfig = tools.pageConfig || (tools.pageConfig = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.pageConfig').
    /* @ngInject */
    factory('pageConfigResource', function ($http) {
    'use strict';
    var configUri = config.root + 'api/rest/display/config/';
    function _getListQueryString() {
        var queryString = configUri + 'list';
        queryString += '?rand=' + Math.random();
        return queryString;
    }
    function _getConfigQueryString(id) {
        var queryString = configUri + id;
        queryString += '?rand=' + Math.random();
        return queryString;
    }
    function _getPageConfigList() {
        return $http.get(_getListQueryString()).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _getPageConfig(id) {
        return $http.get(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _deletePageConfig(id) {
        return $http.delete(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _savePageConfig(template) {
        return $http.post(configUri, template).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        getPageConfigs: function () {
            return _getPageConfigList();
        },
        getPageConfig: function (id) {
            return _getPageConfig(id);
        },
        deletePageConfig: function (id) {
            return _deletePageConfig(id);
        },
        savePageConfig: function (template) {
            return _savePageConfig(template);
        }
    };
});

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var savedSearch;
        (function (savedSearch) {
            'use strict';
            angular.module('vs.tools.savedSearch', []);
        })(savedSearch = tools.savedSearch || (tools.savedSearch = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.savedSearch').
    /* @ngInject */
    factory('savedSearchResource', function ($http) {
    'use strict';
    // function _doSave(request: any) {
    //   request.query += '/disp=' + request.config;
    //   request.path = request.query;
    //   // return sugar.postJson(request, 'display', 'ssearch');
    // }
    function _getQueryString() {
        var rows = 150; // @TODO set to what we really want
        var queryString = config.root + 'solr/ssearch/select?';
        queryString += 'rows=' + rows + '&rand=' + Math.random();
        queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle]';
        queryString += '&wt=json&json.wrf=JSON_CALLBACK';
        return queryString;
    }
    function _execute() {
        return $http.jsonp(_getQueryString()).then(function (data) {
            return data.data.response.docs;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        getSavedSearches: function () {
            return _execute();
        },
        // saveSearch: function(savedSearch, params) {
        //   savedSearch.config = configService.getConfigId();
        //   savedSearch.query = converter.toClassicParams(params);
        //   return _doSave(savedSearch);
        // },
        deleteSearch: function (id) {
            return $http.delete(config.root + 'api/rest/display/ssearch/' + id).then(function () {
                // observers.forEach(function (entry) {
                //   entry(id);
                // });
            });
        },
        order: function (id, beforeId, afterId) {
            var data = '';
            if (beforeId !== null) {
                data += 'before=' + beforeId;
            }
            if (data !== '') {
                data += '&';
            }
            if (afterId !== null) {
                data += 'after=' + afterId;
            }
            // return sugar.postForm('api/rest/display/ssearch/' + id + '/order', data);
        }
    };
});

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var translate;
        (function (translate) {
            var Translator = (function () {
                /* @ngInject */
                function Translator(config, $http, $q) {
                    this.config = config;
                    this.$http = $http;
                    this.$q = $q;
                    this.fields = null;
                }
                Translator.prototype.load = function () {
                    var _this = this;
                    var resourceUrl = this.config.root + 'api/rest/i18n/fields/standard.json';
                    if (!this.fields) {
                        return this.$http.get(resourceUrl).then(function (res) {
                            _this.fields = res.data;
                            return res.data;
                        });
                    }
                    else {
                        return this.$q.when();
                    }
                };
                Translator.prototype.translateField = function (field) {
                    var translated = this.fields.FIELD[field];
                    if (angular.isDefined(translated)) {
                        return translated;
                    }
                    else {
                        return this.classify(field);
                    }
                };
                Translator.prototype.classify = function (str) {
                    str = str.replace(/_/g, ' ');
                    return str.replace(/\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                };
                return Translator;
            })();
            translate.Translator = Translator;
        })(translate = tools.translate || (tools.translate = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="translator.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var translate;
        (function (translate) {
            'use strict';
            angular.module('vs.tools.translate', [])
                .factory('translator', function (config, $http, $q) { return new translate.Translator(config, $http, $q); })
                .constant('config', config);
        })(translate = tools.translate || (tools.translate = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="sugar.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var util;
        (function (util) {
            'use strict';
            angular.module('vs.tools.util', [])
                .factory('sugar', function (config, $http) { return util.Sugar.getInstance(config, $http); });
        })(util = tools.util || (tools.util = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdNb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnUmVzb3VyY2UudHMiLCJmaWx0ZXJzL2ZpbHRlcnMudHMiLCJ1dGlsL3N1Z2FyLnRzIiwiZmllbGRzL2ZpZWxkcy5yZXNvdXJjZS50cyIsImZpZWxkcy9maWVsZHMubW9kdWxlLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctbW9kdWxlLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctcmVzb3VyY2UudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInRyYW5zbGF0ZS90cmFuc2xhdG9yLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5tb2R1bGUudHMiLCJ1dGlsL3V0aWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbInZzIiwidnMudG9vbHMiLCJ2cy50b29scy5Db25maWciLCJ2cy50b29scy5Db25maWcuY29uc3RydWN0b3IiLCJ2cy50b29scy5SdW5CbG9jayIsInZzLnRvb2xzLlJ1bkJsb2NrLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZGlzcGxheUNvbmZpZyIsIl9nZXRMaXN0UXVlcnlTdHJpbmciLCJfZ2V0Q29uZmlnUXVlcnlTdHJpbmciLCJfZ2V0RGlzcGxheUNvbmZpZ0xpc3QiLCJfZ2V0RGlzcGxheUNvbmZpZyIsIl9kZWxldGVEaXNwbGF5Q29uZmlnIiwiX3NhdmVEaXNwbGF5Q29uZmlnIiwidnMudG9vbHMuZmlsdGVycyIsInZzLnRvb2xzLnV0aWwiLCJ2cy50b29scy51dGlsLlN1Z2FyIiwidnMudG9vbHMudXRpbC5TdWdhci5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLnV0aWwuU3VnYXIuaXNTdHJpbmciLCJ2cy50b29scy51dGlsLlN1Z2FyLmdldEluc3RhbmNlIiwidnMudG9vbHMudXRpbC5TdWdhci50b01hcCIsInZzLnRvb2xzLnV0aWwuU3VnYXIudG9TdHJpbmdNYXAiLCJ2cy50b29scy51dGlsLlN1Z2FyLnBsdWNrIiwidnMudG9vbHMudXRpbC5TdWdhci5wb3N0Rm9ybSIsInZzLnRvb2xzLmZpZWxkcyIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZSIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZS5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLmZpZWxkcy5GaWVsZHNSZXNvdXJjZS5nZXRGaWVsZHNQYXJhbXMiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuZ2V0U3RhdHNQYXJhbXMiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuYXBwbHlIeWRyYXRpb24iLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuZ2V0Q291bnQiLCJ2cy50b29scy5wYWdlQ29uZmlnIiwiX2dldFBhZ2VDb25maWdMaXN0IiwiX2dldFBhZ2VDb25maWciLCJfZGVsZXRlUGFnZUNvbmZpZyIsIl9zYXZlUGFnZUNvbmZpZyIsInZzLnRvb2xzLnNhdmVkU2VhcmNoIiwiX2dldFF1ZXJ5U3RyaW5nIiwiX2V4ZWN1dGUiLCJ2cy50b29scy50cmFuc2xhdGUiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvciIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yLmNvbnN0cnVjdG9yIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IubG9hZCIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yLnRyYW5zbGF0ZUZpZWxkIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IuY2xhc3NpZnkiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sRUFBRSxDQVlSO0FBWkQsV0FBTyxFQUFFO0lBQUNBLElBQUFBLEtBQUtBLENBWWRBO0lBWlNBLFdBQUFBLEtBQUtBLEVBQUNBLENBQUNBO1FB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QUFLQSxPQUFBQSxVQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQSxLQUFLQSxDQUFDQSxFQUFoQ0EsQ0FBZ0NBLENBQUNBLENBQUNBO1FBQzNFQSxDQUFDQSxFQU5lYixJQUFJQSxHQUFKQSxVQUFJQSxLQUFKQSxVQUFJQSxRQU1uQkE7SUFBREEsQ0FBQ0EsRUFOU0QsS0FBS0EsR0FBTEEsUUFBS0EsS0FBTEEsUUFBS0EsUUFNZEE7QUFBREEsQ0FBQ0EsRUFOTSxFQUFFLEtBQUYsRUFBRSxRQU1SIiwiZmlsZSI6InZzLnRvb2xraXQubWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBDb25maWcge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nUHJvdmlkZXI6IG5nLklMb2dQcm92aWRlcikge1xuICAgICAgLy8gZW5hYmxlIGxvZ1xuICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCh0cnVlKTtcbiAgICAgIC8vIHNldCBvcHRpb25zIHRoaXJkLXBhcnR5IGxpYlxuICAgIH1cblxuICB9XG59XG4iLCJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIFJ1bkJsb2NrIHtcbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJGxvZzogbmcuSUxvZ1NlcnZpY2UpIHtcbiAgICAgICRsb2cuZGVidWcoJ3J1bkJsb2NrIGVuZCcpO1xuICAgIH1cblxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LmNvbmZpZy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXgucnVuLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMnLCBbXSlcbiAgICAuY29uZmlnKENvbmZpZylcbiAgICAucnVuKFJ1bkJsb2NrKVxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcbn1cbiIsIm1vZHVsZSB2cy50b29scy5kaXNwbGF5Q29uZmlnIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5kaXNwbGF5Q29uZmlnJywgW10pO1xufVxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZGlzcGxheUNvbmZpZycpLlxuXHQvKiBAbmdJbmplY3QgKi9cblx0ZmFjdG9yeSgnZGlzcGxheUNvbmZpZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnkpIHtcblxuXHRcdCd1c2Ugc3RyaWN0JztcblxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2Rpc3BsYXlfY29uZmlnLyc7XG5cblx0XHRmdW5jdGlvbiBfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkge1xuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgJ2xpc3QnO1xuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9nZXRDb25maWdRdWVyeVN0cmluZyhpZDogc3RyaW5nKSB7XG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyBpZDtcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRMaXN0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX2dldERpc3BsYXlDb25maWcoaWQ6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZGVsZXRlKF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZTogYW55KSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChjb25maWdVcmksIHRlbXBsYXRlKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWdMaXN0KCk7XG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gX2dldERpc3BsYXlDb25maWcoaWQpO1xuXHRcdFx0fSxcblx0XHRcdGRlbGV0ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuIF9kZWxldGVEaXNwbGF5Q29uZmlnKGlkKTtcblx0XHRcdH0sXG5cdFx0XHRzYXZlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24odGVtcGxhdGU6IGFueSl7XG5cdFx0XHRcdHJldHVybiBfc2F2ZURpc3BsYXlDb25maWcodGVtcGxhdGUpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0pO1xuIiwibW9kdWxlIHZzLnRvb2xzLmZpbHRlcnMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmZpbHRlcnMnLCBbXSlcbiAgICAuZmlsdGVyKCdyZXBsYWNlU3RyaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oaGF5U3RhY2s6IHN0cmluZywgb2xkTmVlZGxlOiBzdHJpbmcsIG5ld05lZWRsZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBoYXlTdGFjay5yZXBsYWNlKG9sZE5lZWRsZSwgbmV3TmVlZGxlKTtcbiAgICAgIH07XG4gICAgfSk7XG4gfVxuIiwibW9kdWxlIHZzLnRvb2xzLnV0aWwge1xuXG5cdGV4cG9ydCBjbGFzcyBTdWdhciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIHt9XG5cblx0XHRwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHZhbDogYW55KSB7XG5cdFx0XHRyZXR1cm4gKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnIHx8IHZhbCBpbnN0YW5jZW9mIFN0cmluZyk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIGdldEluc3RhbmNlKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlKSA6IFN1Z2FyIHtcblx0XHRcdHJldHVybiBuZXcgU3VnYXIoY29uZmlnLCAkaHR0cCk7XG5cdFx0fVxuXG5cdFx0dG9NYXAoa2V5OiBhbnksIGFycmF5OiBhbnkpIHtcblx0XHRcdHZhciBtYXAgPSB7fTtcblx0XHRcdGFycmF5LmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcblx0XHRcdFx0bWFwW3ZhbHVlW2tleV1dID0gdmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fVxuXG5cdFx0dG9TdHJpbmdNYXAoYXJyYXk6IGFueSkge1xuXHRcdFx0dmFyIG1hcCA9IHt9O1xuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0XHRtYXBbdmFsdWVdID0gdmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fVxuXG4gICAgcGx1Y2soYXJyYXk6IGFueSwgbmFtZTogc3RyaW5nLCBmbj86IEZ1bmN0aW9uKSB7XG4gICAgICB2YXIgZmwgPSBbXTtcbiAgICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsdWU6IGFueSl7XG4gICAgICAgIGlmIChmbiAmJiBmbih2YWx1ZSkpIHtcbiAgICAgICAgICBmbC5wdXNoKHZhbHVlW25hbWVdKTtcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGZuKSkge1xuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmbDtcbiAgICB9XG5cbiAgICBwb3N0Rm9ybSh1cmw6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgICB2YXIgc2VydmljZSA9IHRoaXMuY29uZmlnLnJvb3QgKyB1cmw7XG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6IHNlcnZpY2UsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCd9XG4gICAgICB9KTtcbiAgICB9XG5cdH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3V0aWwvc3VnYXIudHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcbid1c2Ugc3RyaWN0JztcblxuXHRleHBvcnQgaW50ZXJmYWNlIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0ZmV0Y2goZmllbGRzPzogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzKHF1ZXJ5OiBzdHJpbmcpOiBuZy5JUHJvbWlzZTxhbnk+O1xuXHR9XG5cblx0ZXhwb3J0IGNsYXNzIEZpZWxkc1Jlc291cmNlIGltcGxlbWVudHMgSUZpZWxkc1Jlc291cmNlIHtcblx0XHRzdGF0aWMgcmVmTmFtZSA9ICdmaWVsZHNSZXNvdXJjZSc7XG5cblx0XHRmZXRjaDogKHByb3BlcnRpZXM/OiBzdHJpbmcpID0+IGFueTtcblx0XHRmZXRjaEh5ZHJhdGlvblN0YXRzOiAocXVlcnk6IHN0cmluZykgPT4gYW55O1xuXG5cdFx0LyogQG5nSW5qZWN0ICovXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzdWdhcjogYW55KSB7XG5cblx0XHRcdHRoaXMuZmV0Y2ggPSAoZmllbGRzPzogYW55KSA9PiB7XG5cdFx0XHRcdHZhciBmbCA9IChmaWVsZHMgfHwgJ25hbWUsY2F0ZWdvcnksZG9jcyxkaXNwX2VuJyk7XG5cdFx0XHRcdHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci9maWVsZHMvc2VsZWN0JywgdGhpcy5nZXRGaWVsZHNQYXJhbXMoZmwpKS50aGVuKChyZXM6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlcy5kYXRhLnJlc3BvbnNlLmRvY3M7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLmZldGNoSHlkcmF0aW9uU3RhdHMgPSAocXVlcnk6IHN0cmluZykgPT4ge1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoKCkudGhlbigoZmllbGRzOiBBcnJheTxhbnk+KSA9PiB7XG4gICAgICAgICAgdmFyIGZsID0gc3VnYXIucGx1Y2soZmllbGRzLCAnbmFtZScsIGZ1bmN0aW9uKGZpZWxkKSB7IHJldHVybiBmaWVsZC5uYW1lLmluZGV4T2YoJ18nKSAhPT0gMCAmJiBmaWVsZC5kb2NzID4gMDsgfSk7XG5cbiAgICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvdjAvc2VsZWN0PycgKyBxdWVyeSwgdGhpcy5nZXRTdGF0c1BhcmFtcyhmbCkpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICB2YXIgc3RhdHNGaWVsZHMgPSByZXMuZGF0YS5mYWNldF9jb3VudHMuZmFjZXRfZmllbGRzO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gcmVzLmRhdGEucmVzcG9uc2UubnVtRm91bmQ7XG4gICAgICAgICAgICB0aGlzLmFwcGx5SHlkcmF0aW9uKHN0YXRzRmllbGRzLCBmaWVsZHMsIHRvdGFsKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cdFx0XHR9O1xuXG5cdFx0fVxuXG4gICAgcHJpdmF0ZSBnZXRGaWVsZHNQYXJhbXMoZmwpIHtcbiAgICAgIHJldHVybiAncT0qOiomZmw9JyArIGZsICsgJyZyb3dzPTEwMDAwJnNvcnQ9bmFtZSUyMGFzYyZ3dD1qc29uJztcbiAgICB9XG5cblxuICAgIHByaXZhdGUgZ2V0U3RhdHNQYXJhbXMoZmwpIHtcbiAgICAgIHJldHVybiAnZmFjZXQ9dHJ1ZSZmYWNldC5saW1pdD0xMDAwMCZmYWNldC5taW5jb3VudD0xMDAmcm93cz0wJnd0PWpzb24mZmFjZXQuZmllbGQ9JyArIGZsLmpvaW4oJyZmYWNldC5maWVsZD0nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGx5SHlkcmF0aW9uKHN0YXRzRmllbGRzLCBmaWVsZHMsIHRvdGFsKSB7XG4gICAgICB2YXIgc3RhdHNGaWVsZCwgY291bnQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzdGF0c0ZpZWxkID0gc3RhdHNGaWVsZHNbZmllbGRzW2ldLm5hbWVdO1xuICAgICAgICBpZiAoc3RhdHNGaWVsZCAmJiBzdGF0c0ZpZWxkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmaWVsZHNbaV0uaWQgPSBmaWVsZHNbaV0ubmFtZTtcbiAgICAgICAgICBjb3VudCA9IHRoaXMuZ2V0Q291bnQoc3RhdHNGaWVsZCk7XG4gICAgICAgICAgZmllbGRzW2ldLmh5ZHJhdGlvbiA9IGNvdW50IC8gdG90YWwgKiAxMDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q291bnQoZmllbGQpIHtcbiAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGZpZWxkLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIGNvdW50ICs9IGZpZWxkW2ldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZpZWxkcy5yZXNvdXJjZS50c1wiIC8+XG5cbm1vZHVsZSB2cy50b29scy5maWVsZHMge1xuJ3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWVsZHMnLCBbJ3ZzLnRvb2xzLnV0aWwnXSlcblx0XHQuc2VydmljZShGaWVsZHNSZXNvdXJjZS5yZWZOYW1lLCBGaWVsZHNSZXNvdXJjZSk7XG5cbn1cbiIsIm1vZHVsZSB2cy50b29scy5wYWdlQ29uZmlnIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5wYWdlQ29uZmlnJywgW10pO1xufVxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xuZGVjbGFyZSB2YXIgY29uZmlnO1xuXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMucGFnZUNvbmZpZycpLlxuXHQvKiBAbmdJbmplY3QgKi9cblx0ZmFjdG9yeSgncGFnZUNvbmZpZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnkpIHtcblxuXHRcdCd1c2Ugc3RyaWN0JztcblxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2NvbmZpZy8nO1xuXG5cdFx0ZnVuY3Rpb24gX2dldExpc3RRdWVyeVN0cmluZygpIHtcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArICdsaXN0Jztcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQ6IHN0cmluZykge1xuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgaWQ7XG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX2dldFBhZ2VDb25maWdMaXN0KCkge1xuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xuXHRcdFx0XHRyZXR1cm4gZGF0YTtcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdFx0XHRcdHJldHVybiBlcnJvcjtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIF9nZXRQYWdlQ29uZmlnKGlkOiBzdHJpbmcpIHtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gX2RlbGV0ZVBhZ2VDb25maWcoaWQ6IHN0cmluZykge1xuXHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZShfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfc2F2ZVBhZ2VDb25maWcodGVtcGxhdGU6IGFueSkge1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoY29uZmlnVXJpLCB0ZW1wbGF0ZSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBkYXRhO1xuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGdldFBhZ2VDb25maWdzOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIF9nZXRQYWdlQ29uZmlnTGlzdCgpO1xuXHRcdFx0fSxcblx0XHRcdGdldFBhZ2VDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcblx0XHRcdFx0cmV0dXJuIF9nZXRQYWdlQ29uZmlnKGlkKTtcblx0XHRcdH0sXG5cdFx0XHRkZWxldGVQYWdlQ29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XG5cdFx0XHRcdHJldHVybiBfZGVsZXRlUGFnZUNvbmZpZyhpZCk7XG5cdFx0XHR9LFxuXHRcdFx0c2F2ZVBhZ2VDb25maWc6IGZ1bmN0aW9uKHRlbXBsYXRlOiBhbnkpe1xuXHRcdFx0XHRyZXR1cm4gX3NhdmVQYWdlQ29uZmlnKHRlbXBsYXRlKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9KTtcbiIsIm1vZHVsZSB2cy50b29scy5zYXZlZFNlYXJjaCB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnLCBbXSk7XG59XG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXG5kZWNsYXJlIHZhciBjb25maWc7XG5cbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcpLlxuXHQvKiBAbmdJbmplY3QgKi9cbiAgZmFjdG9yeSgnc2F2ZWRTZWFyY2hSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBmdW5jdGlvbiBfZG9TYXZlKHJlcXVlc3Q6IGFueSkge1xuICAgIC8vICAgcmVxdWVzdC5xdWVyeSArPSAnL2Rpc3A9JyArIHJlcXVlc3QuY29uZmlnO1xuICAgIC8vICAgcmVxdWVzdC5wYXRoID0gcmVxdWVzdC5xdWVyeTtcbiAgICAvLyAgIC8vIHJldHVybiBzdWdhci5wb3N0SnNvbihyZXF1ZXN0LCAnZGlzcGxheScsICdzc2VhcmNoJyk7XG4gICAgLy8gfVxuXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5U3RyaW5nKCkge1xuICAgICAgdmFyIHJvd3MgPSAxNTA7ICAvLyBAVE9ETyBzZXQgdG8gd2hhdCB3ZSByZWFsbHkgd2FudFxuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD8nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJmZsPWlkLHRpdGxlLGRlc2NyaXB0aW9uLG93bmVyLHBhdGgsc2hhcmUscXVlcnksY29uZmlnLG9yZGVyLHNhdmVkLHByaXZhdGUsdmlldyxfdmVyc2lvbl8sY29uZmlnX3RpdGxlOltjb25maWdUaXRsZV0nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKCkge1xuICAgICAgcmV0dXJuICRodHRwLmpzb25wKF9nZXRRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YS5yZXNwb25zZS5kb2NzO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICAvLyBAVE9ETzogaGFuZGxlIGVycm9yXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFNhdmVkU2VhcmNoZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX2V4ZWN1dGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIHNhdmVTZWFyY2g6IGZ1bmN0aW9uKHNhdmVkU2VhcmNoLCBwYXJhbXMpIHtcbiAgICAgIC8vICAgc2F2ZWRTZWFyY2guY29uZmlnID0gY29uZmlnU2VydmljZS5nZXRDb25maWdJZCgpO1xuICAgICAgLy8gICBzYXZlZFNlYXJjaC5xdWVyeSA9IGNvbnZlcnRlci50b0NsYXNzaWNQYXJhbXMocGFyYW1zKTtcbiAgICAgIC8vICAgcmV0dXJuIF9kb1NhdmUoc2F2ZWRTZWFyY2gpO1xuICAgICAgLy8gfSxcblxuICAgICAgZGVsZXRlU2VhcmNoOiBmdW5jdGlvbihpZDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIC8vIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcbiAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZDogYW55LCBiZWZvcmVJZDogYW55LCBhZnRlcklkOiBhbnkpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYgKGJlZm9yZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYmVmb3JlPScgKyBiZWZvcmVJZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YSAhPT0gJycpIHtcbiAgICAgICAgICBkYXRhICs9ICcmJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZnRlcklkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYWZ0ZXI9JyArIGFmdGVySWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwibW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG5cbiAgZXhwb3J0IGNsYXNzIFRyYW5zbGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBmaWVsZHM6IGFueSA9IG51bGw7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UsIHByaXZhdGUgJHE6IG5nLklRU2VydmljZSkge1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKCkge1xuICAgICAgdmFyIHJlc291cmNlVXJsID0gdGhpcy5jb25maWcucm9vdCArICdhcGkvcmVzdC9pMThuL2ZpZWxkcy9zdGFuZGFyZC5qc29uJztcblxuICAgICAgaWYgKCF0aGlzLmZpZWxkcykge1xuICAgICAgICByZXR1cm4gdGhpcy4kaHR0cC5nZXQocmVzb3VyY2VVcmwpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5maWVsZHMgPSByZXMuZGF0YTtcbiAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJHEud2hlbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0cmFuc2xhdGVGaWVsZChmaWVsZDogc3RyaW5nKSB7XG4gICAgICB2YXIgdHJhbnNsYXRlZCA9IHRoaXMuZmllbGRzLkZJRUxEW2ZpZWxkXTtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0cmFuc2xhdGVkKSkge1xuICAgICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsYXNzaWZ5KHN0cjogc3RyaW5nKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uKHR4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0cmFuc2xhdG9yLnRzXCIgLz5cbm1vZHVsZSB2cy50b29scy50cmFuc2xhdGUge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy50cmFuc2xhdGUnLCBbXSlcbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICAuZmFjdG9yeSgndHJhbnNsYXRvcicsIChjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgJHE6IG5nLklRU2VydmljZSkgPT4gbmV3IFRyYW5zbGF0b3IoY29uZmlnLCAkaHR0cCwgJHEpKVxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdWdhci50c1wiIC8+XG5tb2R1bGUgdnMudG9vbHMudXRpbCB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMudXRpbCcsIFtdKVxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIC5mYWN0b3J5KCdzdWdhcicsIChjb25maWcsICRodHRwKSA9PiBTdWdhci5nZXRJbnN0YW5jZShjb25maWcsICRodHRwKSk7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

//# sourceMappingURL=maps/vs.toolkit.src.js.map
