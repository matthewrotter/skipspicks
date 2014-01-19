/*
  This should really become a directive
 */

angular.module('slideout', [])
  .run(['$rootScope', '$menu', function($rootScope, $menu){
    $rootScope.$menu = $menu;
  }])
  .provider("$menu", function(){
    this.$get = [function(){
      var menu = {};

      menu.show = function show(){
        var menu = angular.element(document.querySelector('#header'));
        menu.addClass('show');
      };

      menu.hide = function hide(){
        var menu = angular.element(document.querySelector('#header'));
        menu.removeClass('show');
      };

      menu.toggle = function toggle() {
        var menu = angular.element(document.querySelector('#header'));
        menu.toggleClass('show');
      };

      return menu;
    }];
  });