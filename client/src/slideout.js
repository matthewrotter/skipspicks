/*
 This should really become a directive
 */

angular.module('slideout', [])
  .run(['$rootScope', '$menu', function($rootScope, $menu) {
    $rootScope.$menu = $menu;
  }])
  .provider("$menu", function() {
    this.$get = [function() {
      var menu = {
        // BEER: I'm sure this is super jank
        swap: function swap() {
          var self = this;
          var menu = angular.element(document.querySelector('#context'));
          if (menu.hasClass('show')) {
            var tend = function tend() {
              menu[0].removeEventListener('transitionend', tend);
              self.show();
            };
            menu[0].addEventListener('transitionend', tend);
            this.hide();
          } else {
            this.show();
          }
        },
        switchOrientation: function(degree) {
          var menu = angular.element(document.querySelector('#context'));
          if (degree === 0) {
            menu.removeClass('landscape');
            menu.addClass('portrait');
          } else {
            menu.removeClass('portrait');
            menu.addClass('landscape');
          }
        }
      };

      menu.show = function show() {
        var menu = angular.element(document.querySelector('#context'));
        menu.addClass('show');
      };

      menu.hide = function hide() {
        var menu = angular.element(document.querySelector('#context'));
        menu.removeClass('show');
      };

      menu.toggle = function toggle() {
        var menu = angular.element(document.querySelector('#context'));
        menu.toggleClass('show');
      };

      return menu;
    }];
  });