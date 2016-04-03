package com.github.corneil.data_rest_demo.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by Corneil on 2016/04/03.
 */
@Controller
@RequestMapping("/")
public class ApplicationController {
    @RequestMapping
    public ModelAndView index() {
        return new ModelAndView("users/manage");
    }
}
