yieldUnescaped '<!DOCTYPE html>'
appName = 'springDataRestDemo'
stylesheets = [
        'http://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic',
        '/webjars/angular-material/1.0.6/angular-material.css',
        '/css/app.css'
]
scripts = ['/webjars/angular/1.5.2/angular.js',
           '/webjars/angular-animate/1.5.2/angular-animate.js',
            '/webjars/angular-aria/1.5.2/angular-aria.js',
            '/webjars/angular-material/1.0.6/angular-material.js',
            '/js//Users.js',
            '/js/UserController.js',
            '/js/UserService.js'
]
metaStrings = [
        [charset: 'utf-8'],
        ['http-equiv': 'X-UA-Compatible', content: 'IE=edge'],
        [name: 'description', content: ''],
        [name: 'viewport', content: 'initial-scale=1, maximum-scale=1, user-scalable=no']
]
html {
    head {
        title('User - List')
        metaStrings.each {
            meta(it)
        }
        stylesheets.each {
            link(rel: 'stylesheet', href: it)
        }
        style(type: 'text/css') {
            /**
             * Hide when Angular is not yet loaded and initialized
             */
            yieldUnescaped '''[ng\\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak {
                        display: none !important;
                    }'''
        }
    }
    body('ng-app': appName, layout: 'row', 'ng-controller': 'UserController as ul', 'ng-cloak':'') {
        'md-sidenav'(class: 'site-sidenav md-sidenav-left md-whiteframe-z2',
                'md-component-id': "left",
                'ng-click': 'ul.toggleList()',
                'aria-label': 'Show User List',
                'md-is-locked-open': '$mdMedia(\'gt-sm\')') {
            'md-toolbar'(class: 'md-whiteframe-z1') {
                h3('Users')
            }
            'md-list' {
                'md-list-item'('ng-repeat': 'it in ul.users') {
                    'md-button'('ng-click': 'ul.selectUser(it)', 'ng-class': "{'selected' : it === ul.selected }") {
                        'md-icon'('md-svg-icon': '{{ it.avatar }}', class:'avatar')
                        yield '{{it.name}}'
                    }
                }
            }
        }
        div('flex':'', layout: 'column', tabIndex: '-1', role: 'main', class: 'md-whiteframe-z2') {
            'md-toolbar'(layout: 'row', class: 'md-whiteframe-z1') {
                'md-button'(id: 'main', class: 'menu', 'hide-gt-sm', 'ng-click': 'ul.toggleList()', 'aria-label': 'Show User List') {
                    'md-icon'('md-svg-icon': 'menu')
                }
                h3('Angular Material - Starter App')
            }
            'md-content'('flex':'', id: 'content') {
                'md-icon'('md-svg-icon': '{{ul.selected.avatar}}', class: 'avatar')
                h2('{{ul.selected.name}}')
                p('{{ul.selected.content}}')
                'md-button'(class: 'contact', 'md-no-ink', 'ng-click': 'ul.makeContact(ul.selected)', 'aria-label': 'Share with {{ ul.selected.name }}') {
                    'md-tooltip' { yield 'Contact {{ ul.selected.name }}' }
                    'md-icon'('md-svg-icon': 'share')
                }
            }
        }
        scripts.each { src ->
            script(type: 'text/javascript', src: src)
            newLine()
        }
        script(type:'text/javascript') {
            yieldUnescaped """
            angular.module('$appName', ['ngMaterial', 'users'])
                    .config(function(\$mdThemingProvider, \$mdIconProvider) {
                            \$mdIconProvider.defaultIconSet('/assets/svg/avatars.svg', 128)
                                    .icon('menu', '/assets/svg/menu.svg', 24)
                                    .icon('share', '/assets/svg/share.svg', 24);
                            \$mdThemingProvider.theme('default')
                                    .primaryPalette('blue')
                                    .accentPalette('green');
                    });
            """
        }
    }
}