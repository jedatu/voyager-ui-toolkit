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
            .run(tools.RunBlock);
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

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
        var savedSearch;
        (function (savedSearch) {
            'use strict';
            angular.module('vs.tools.savedSearch', []);
        })(savedSearch = tools.savedSearch || (tools.savedSearch = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.savedSearch').
    factory('savedSearchResource', function (sugar, $http, $q, configService, converter) {
    'use strict';
    function _doSave(request) {
        if (configService.hasChanges()) {
            var deferred = $q.defer();
            sugar.postJson(configService.getUpdatedSettings(), 'display', 'config').then(function (response) {
                request.config = response.data.id;
                /* jshint ignore:start */
                request.query += '/disp=' + request.config;
                request.path = request.query;
                sugar.postJson(request, 'display', 'ssearch').then(function (savedResponse) {
                    deferred.resolve();
                }, function (error) {
                    deferred.reject(error);
                });
                /* jshint ignore:end */
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        else {
            request.query += '/disp=' + request.config;
            request.path = request.query;
            return sugar.postJson(request, 'display', 'ssearch');
        }
    }
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
        saveSearch: function (savedSearch, params) {
            savedSearch.config = configService.getConfigId();
            savedSearch.query = converter.toClassicParams(params);
            return _doSave(savedSearch);
        },
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
            return sugar.postForm('api/rest/display/ssearch/' + id + '/order', data);
        }
    };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImZpbHRlcnMvZmlsdGVycy50cyIsInNhdmVkLXNlYXJjaC9zYXZlZC1zZWFyY2gtbW9kdWxlLnRzIiwic2F2ZWQtc2VhcmNoL3NhdmVkU2VhcmNoLnJlc291cmNlLnRzIl0sIm5hbWVzIjpbInZzIiwidnMudG9vbHMiLCJ2cy50b29scy5Db25maWciLCJ2cy50b29scy5Db25maWcuY29uc3RydWN0b3IiLCJ2cy50b29scy5SdW5CbG9jayIsInZzLnRvb2xzLlJ1bkJsb2NrLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZmlsdGVycyIsInZzLnRvb2xzLnNhdmVkU2VhcmNoIiwiX2RvU2F2ZSIsIl9nZXRRdWVyeVN0cmluZyIsIl9leGVjdXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLEVBQUUsQ0FZUjtBQVpELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxLQUFLQSxDQVlkQTtJQVpTQSxXQUFBQSxLQUFLQSxFQUFDQSxDQUFDQTtRQUNmQyxZQUFZQSxDQUFDQTtRQUViQTtZQUNFQyxnQkFBZ0JBO1lBQ2hCQSxnQkFBWUEsWUFBNkJBO2dCQUN2Q0MsYUFBYUE7Z0JBQ2JBLFlBQVlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNoQ0EsOEJBQThCQTtZQUNoQ0EsQ0FBQ0E7WUFFSEQsYUFBQ0E7UUFBREEsQ0FSQUQsQUFRQ0MsSUFBQUQ7UUFSWUEsWUFBTUEsU0FRbEJBLENBQUFBO0lBQ0hBLENBQUNBLEVBWlNELEtBQUtBLEdBQUxBLFFBQUtBLEtBQUxBLFFBQUtBLFFBWWRBO0FBQURBLENBQUNBLEVBWk0sRUFBRSxLQUFGLEVBQUUsUUFZUjs7QUNaRCxJQUFPLEVBQUUsQ0FVUjtBQVZELFdBQU8sRUFBRTtJQUFDQSxJQUFBQSxLQUFLQSxDQVVkQTtJQVZTQSxXQUFBQSxLQUFLQSxFQUFDQSxDQUFDQTtRQUNmQyxZQUFZQSxDQUFDQTtRQUViQTtZ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QixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLDJCQUEyQixHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDbkUsdUNBQXVDO2dCQUN2QyxlQUFlO2dCQUNmLE1BQU07WUFDUixDQUFDLENBQUMsQ0FBQztRQUNULENBQUM7UUFFRCxLQUFLLEVBQUUsVUFBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU87WUFDbkMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsRUFBRSxDQUFBLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQy9CLENBQUM7WUFDRCxFQUFFLENBQUEsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLElBQUksR0FBRyxDQUFDO1lBQ2QsQ0FBQztZQUVELEVBQUUsQ0FBQSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUM3QixDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsMkJBQTJCLEdBQUcsRUFBRSxHQUFHLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzRSxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InZzLnRvb2xraXQubWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBDb25maWcge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nUHJvdmlkZXI6IG5nLklMb2dQcm92aWRlcikge1xuICAgICAgLy8gZW5hYmxlIGxvZ1xuICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCh0cnVlKTtcbiAgICAgIC8vIHNldCBvcHRpb25zIHRoaXJkLXBhcnR5IGxpYlxuICAgIH1cblxuICB9XG59XG4iLCJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIFJ1bkJsb2NrIHtcbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJGxvZzogbmcuSUxvZ1NlcnZpY2UpIHtcbiAgICAgICRsb2cuZGVidWcoJ3J1bkJsb2NrIGVuZCcpO1xuICAgIH1cblxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LmNvbmZpZy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXgucnVuLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scycsIFtdKVxuICAgIC5jb25maWcoQ29uZmlnKVxuICAgIC5ydW4oUnVuQmxvY2spO1xufVxuIiwibW9kdWxlIHZzLnRvb2xzLmZpbHRlcnMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmZpbHRlcnMnLCBbXSlcbiAgICAuZmlsdGVyKCdyZXBsYWNlU3RyaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oaGF5U3RhY2s6IHN0cmluZywgb2xkTmVlZGxlOiBzdHJpbmcsIG5ld05lZWRsZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBoYXlTdGFjay5yZXBsYWNlKG9sZE5lZWRsZSwgbmV3TmVlZGxlKTtcbiAgICAgIH07XG4gICAgfSk7XG4gfVxuIiwibW9kdWxlIHZzLnRvb2xzLnNhdmVkU2VhcmNoIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcsIFtdKTtcbn1cbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cbmRlY2xhcmUgdmFyIGNvbmZpZztcblxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnNhdmVkU2VhcmNoJykuXG4gIGZhY3RvcnkoJ3NhdmVkU2VhcmNoUmVzb3VyY2UnLCBmdW5jdGlvbiAoc3VnYXIsICRodHRwLCAkcSwgY29uZmlnU2VydmljZSwgY29udmVydGVyKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgZnVuY3Rpb24gX2RvU2F2ZShyZXF1ZXN0KSB7XG5cbiAgICAgIGlmIChjb25maWdTZXJ2aWNlLmhhc0NoYW5nZXMoKSkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuICAgICAgICBzdWdhci5wb3N0SnNvbihjb25maWdTZXJ2aWNlLmdldFVwZGF0ZWRTZXR0aW5ncygpLCAnZGlzcGxheScsICdjb25maWcnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgcmVxdWVzdC5jb25maWcgPSByZXNwb25zZS5kYXRhLmlkO1xuICAgICAgICAgIC8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cbiAgICAgICAgICByZXF1ZXN0LnF1ZXJ5ICs9ICcvZGlzcD0nICsgcmVxdWVzdC5jb25maWc7XG4gICAgICAgICAgcmVxdWVzdC5wYXRoID0gcmVxdWVzdC5xdWVyeTtcbiAgICAgICAgICBzdWdhci5wb3N0SnNvbihyZXF1ZXN0LCAnZGlzcGxheScsICdzc2VhcmNoJykudGhlbihmdW5jdGlvbihzYXZlZFJlc3BvbnNlKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLyoganNoaW50IGlnbm9yZTplbmQgKi9cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0LnF1ZXJ5ICs9ICcvZGlzcD0nICsgcmVxdWVzdC5jb25maWc7XG4gICAgICAgIHJlcXVlc3QucGF0aCA9IHJlcXVlc3QucXVlcnk7XG4gICAgICAgIHJldHVybiBzdWdhci5wb3N0SnNvbihyZXF1ZXN0LCAnZGlzcGxheScsICdzc2VhcmNoJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldFF1ZXJ5U3RyaW5nKCkge1xuICAgICAgdmFyIHJvd3MgPSAxNTA7ICAvLyBAVE9ETyBzZXQgdG8gd2hhdCB3ZSByZWFsbHkgd2FudFxuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD8nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJmZsPWlkLHRpdGxlLGRlc2NyaXB0aW9uLG93bmVyLHBhdGgsc2hhcmUscXVlcnksY29uZmlnLG9yZGVyLHNhdmVkLHByaXZhdGUsdmlldyxfdmVyc2lvbl8sY29uZmlnX3RpdGxlOltjb25maWdUaXRsZV0nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyZ3dD1qc29uJmpzb24ud3JmPUpTT05fQ0FMTEJBQ0snO1xuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKCkge1xuICAgICAgcmV0dXJuICRodHRwLmpzb25wKF9nZXRRdWVyeVN0cmluZygpKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmRhdGEucmVzcG9uc2UuZG9jcztcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0U2F2ZWRTZWFyY2hlczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfZXhlY3V0ZSgpO1xuICAgICAgfSxcblxuICAgICAgc2F2ZVNlYXJjaDogZnVuY3Rpb24oc2F2ZWRTZWFyY2gsIHBhcmFtcykge1xuICAgICAgICBzYXZlZFNlYXJjaC5jb25maWcgPSBjb25maWdTZXJ2aWNlLmdldENvbmZpZ0lkKCk7XG4gICAgICAgIHNhdmVkU2VhcmNoLnF1ZXJ5ID0gY29udmVydGVyLnRvQ2xhc3NpY1BhcmFtcyhwYXJhbXMpO1xuICAgICAgICByZXR1cm4gX2RvU2F2ZShzYXZlZFNlYXJjaCk7XG4gICAgICB9LFxuXG4gICAgICBkZWxldGVTZWFyY2g6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIC8vIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcbiAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZCwgYmVmb3JlSWQsIGFmdGVySWQpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYoYmVmb3JlSWQgIT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhICs9ICdiZWZvcmU9JyArIGJlZm9yZUlkO1xuICAgICAgICB9XG4gICAgICAgIGlmKGRhdGEgIT09ICcnKSB7XG4gICAgICAgICAgZGF0YSArPSAnJic7XG4gICAgICAgIH1cblxuICAgICAgICBpZihhZnRlcklkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYWZ0ZXI9JyArIGFmdGVySWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

//# sourceMappingURL=maps/vs.toolkit.src.js.map
