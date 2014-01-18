angular.module('slideout', [])
  .run(['$rootScope', '$menu', function($rootScope, $menu){
    $rootScope.$menu = $menu;
  }])
  .provider("$menu", function(){
    this.$get = [function(){
      var menu = {};

      menu.show = function show(){
        var menu = angular.element(document.querySelector('#menu'));
        menu.addClass('show');
      };

      menu.hide = function hide(){
        var menu = angular.element(document.querySelector('#menu'));
        menu.removeClass('show');
      };

      menu.toggle = function toggle() {
        var menu = angular.element(document.querySelector('#menu'));
        menu.toggleClass('show');
      };

      return menu;
    }];
  });