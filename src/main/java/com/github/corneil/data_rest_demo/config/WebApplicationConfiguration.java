package com.github.corneil.data_rest_demo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.groovy.GroovyMarkupConfigurer;

import javax.annotation.PostConstruct;

/**
 * Created by Corneil on 2016/03/28.
 */
@Configuration
public class WebApplicationConfiguration extends WebMvcConfigurerAdapter {
    private final static Logger logger = LoggerFactory.getLogger(WebApplicationConfiguration.class);
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/error").setViewName("error");
        registry.addRedirectViewController("/", "/index.html");
        /*
        registry.addViewController("/").setViewName("index");
        registry.addViewController("/users").setViewName("users/manage");
        registry.addViewController("/groups").setViewName("groups/manage");
        registry.addViewController("/members").setViewName("members/manage");
        registry.addViewController("/admin/hal-browser").setViewName("admin/hal-browser");
        registry.addViewController("/admin/h2-console").setViewName("admin/h2-console");
        */
        logger.info("addViewControllers:{}", registry.toString());
    }
    @Bean
    public RepositoryRestConfigurer repositoryRestConfigurer() {
        return new RepositoryRestConfigurerAdapter() {
            @Override
            public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
                config.setBasePath("/api");
            }
        };
    }
}
