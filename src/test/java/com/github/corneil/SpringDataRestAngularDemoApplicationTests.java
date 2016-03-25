package com.github.corneil;

import com.github.corneil.data_rest_demo.SpringDataRestAngularDemoApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SpringDataRestAngularDemoApplication.class)
@WebAppConfiguration
public class SpringDataRestAngularDemoApplicationTests {

	@Test
	public void contextLoads() {
	}

}
