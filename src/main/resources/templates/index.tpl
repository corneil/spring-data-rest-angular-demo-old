yieldUnescaped '<!DOCTYPE html>'
appName = 'springDataRestDemo'
stylesheets = [
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        '/webjars/angular-material/1.0.6/angular-material.css',
        '/css/app.css'
]
iconSets = [
        'action', 'alert', 'social', 'content'
]
scripts = [
        '/webjars/angular/1.5.3/angular.js',
        '/webjars/angular-animate/1.5.3/angular-animate.js',
        '/webjars/angular-aria/1.5.3/angular-aria.js',
        '/webjars/angular-material/1.0.6/angular-material.js',
        '/js//Users.js',
        '/js/UserController.js',
        '/js/UserService.js'
]
menuItems = [
        [title: 'Users', icon: 'social:ic_person', script: 'loadUsers()'],
        [title: 'Groups', icon: 'social:ic_people', script: 'loadGroups()'],
        [title: 'Group Members', icon: 'social:ic_person_add', script: 'loadMembers()']
]
adminMenuItems = [
        [title: 'HAL Browser', icon: 'social:ic_domain', href: '/api'],
        [title: 'H2 Console', icon: 'action:ic_dashboard', href: '/h2-console']
]
metaStrings = [
        [charset: 'utf-8'],
        ['http-equiv': 'X-UA-Compatible', content: 'IE=edge'],
        [name: 'description', content: ''],
        [name: 'viewport', content: 'initial-scale=1, maximum-scale=1, user-scalable=no']
]
def renderIcon(icon, title) {
    return "<md-icon ${icon.contains('/') ? 'md-svg-src':'md-svg-icon'}='$icon' aria-label='$title'></md-icon>"
}
html {
    head {
        title('User - List')
        metaStrings.each {
            meta(it)
        }
        stylesheets.each {
            link(rel: 'stylesheet', href: it)
        }
    }
    body('ng-app': appName, layout: 'row', 'ng-clock':'') {
        'md-sidenav'(layout: 'column', class: 'md-sidenav-left md-whiteframe-z2',
                'md-component-id': 'left', 'md-is-locked-open': "\$mdMedia('gt-md')") {
            'md-toolbar'(class: 'md-tall md-hue-2') {
                span(flex: '')
                div(layout: 'column', class: 'md-toolbar-tools-bottom inset') {
                    div('Spring Data Rest Demo')
                    div('User Manager')
                }
            }
            'md-menu' {
                'md-menu-content' {
                    menuItems.each { menuItem ->
                        'md-menu-item'(class: 'md-2-line', 'md-ink-ripple': '', role: 'link') {
                            'md-button'(class:'md-primary', 'ng-click': menuItem.script) {
                                yieldUnescaped renderIcon(menuItem.icon, menuItem.title) + System.lineSeparator()
                                span(class: 'md-body-2') { yieldUnescaped menuItem.title }
                            }
                        }
                    }
                }
            }

            'md-divider'()
            'md-subheader'('Management Consoles')
            'md-menu' {
                'md-menu-content' {
                    adminMenuItems.each { menuItem ->
                        'md-menu-item'(class: 'md-2-line', 'md-ink-ripple': '', role: 'link') {
                            'md-button'(class:'md-primary','ng-click': menuItem.script) {
                                yieldUnescaped renderIcon(menuItem.icon, menuItem.title) + System.lineSeparator()
                                span(class: 'md-body-2') { yieldUnescaped menuItem.title }

                            }
                        }
                    }
                }
            }
        }
        div(layout: 'column', class: 'relative', 'layout-fill': '', role: 'main') {
            'md-toolbar' {
                'md-tabs'('md-stretch-tabs': '', class: 'md-primary', 'md-selected': 'data.selectedIndex') {
                    'md-tab'(id: 'tabUsers', 'aria-controls': 'users-content') { yield 'Users' }
                    'md-tab'(id: 'tabGroups', 'aria-controls': 'groups-content') { yield 'Groups' }
                    'md-tab'(id: 'tabMembers', 'aria-controls': 'members-content') { yield 'Members' }
                }
            }
            'md-content'(flex: '', 'md-scroll-y': '') {
                'ui-view'(layout: 'column', 'layout-fill': '', 'layout-padding': '') {
                    div(class: 'inset', 'hide-sm': '')
                    'ng-switch'(on: 'data.selectedIndex', class: 'tabpanel-container') {
                        div(role: 'tabpanel',
                                id: 'users-content',
                                'aria-labelledby': 'tabUsers',
                                'ng-switch-when': '0',
                                'md-swipe-left': 'next()',
                                'md-swipe-right': 'previous()',
                                layout: 'row', 'layout-align': 'center center') {
                            'md-list'(flex: '') {
                                'md-list-item'(class: 'md-3-line', 'ng-repeat': 'user in users') {
                                    div(class: 'md-list-item-text', layout: 'column') {
                                        h3('{{ user.userId }}')
                                        h4('{{ user.fullName }}')
                                        p('{{ user.email }}')
                                    }
                                }
                            }
                            'md-button'(class: 'md-fab md-fab-bottom-right', 'aria-label': 'Add', 'ng-click': 'showAddUser(\$event)') {
                                'md-icon'('md-svg-icon': 'content:ic_add')
                            }
                            // add user edit / create dialog
                        }
                        div(role: 'tabpanel',
                                id: 'group-content',
                                'aria-labelledby': 'tabGroups',
                                'ng-switch-when': '0',
                                'md-swipe-left': 'next()',
                                'md-swipe-right': 'previous()',
                                layout: 'row', 'layout-align': 'center center') {
                            // group stuff here
                        }
                        div(role: 'tabpanel',
                                id: 'members-content',
                                'aria-labelledby': 'tabMembers',
                                'ng-switch-when': '0',
                                'md-swipe-left': 'next()',
                                'md-swipe-right': 'previous()',
                                layout: 'row', 'layout-align': 'center center') {
                            // member stuff here
                        }
                    }
                }
            }
        }
        scripts.each { src ->
            script(type: 'text/javascript', src: src)
            newLine()
        }
        script(type: 'text/javascript') {

            yieldUnescaped """
            var app = angular.module('$appName', ['ngMaterial']);
            app.controller('AppCtrl', ['\$scope', '\$mdSidenav', function(\$scope, \$mdSidenav) {
                \$scope.toggleSidenav = function(menuId) {
                \$mdSidenav(menuId).toggle();
                };
            }]);
            app.config(function(\$mdThemingProvider, \$mdIconProvider) {
                \$mdThemingProvider.theme('default')
                    .primaryPalette('blue')
                    .accentPalette('green');
                \$mdIconProvider.defaultIconSet('fa')"""
            iconSets.each {
                yieldUnescaped "\n.iconSet('$it', '/iconsets/svg/$it-icons.svg', 24)"
            }
            yieldUnescaped '});'
        }
    }
}