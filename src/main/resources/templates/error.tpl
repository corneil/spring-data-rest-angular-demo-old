yieldUnescaped '<!DOCTYPE html>'
html {
    head {
        title('Error')
        meta(charset: 'utf-8')
        meta('http-equiv': 'X-UA-Compatible', content: 'IE=edge')
        link(rel: 'stylesheet', href: '/webjars/angular-material/1.0.6/angular-material.css')
    }
    body {
        div(class: 'md-error') {
            p("${error}")
            p("${status}")
        }
        if (exception != null) {
            div(class: 'md-error') { yield "${exception}" }
        }
        if (message != null) {
            div(class: 'md-error') { yield "${message}" }
        }
        if (stackTrace != null) {
            'md-content'('layout-padding', 'flex') {
                small {
                    pre {
                        yield "${stackTrace}"
                    }
                }
            }
        }
        div(class: 'md-body-2') {
            yield 'Please contact the administrator with the above information.'
        }
    }
}