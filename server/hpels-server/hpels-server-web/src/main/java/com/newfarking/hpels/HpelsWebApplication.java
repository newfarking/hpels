package com.newfarking.hpels;

import com.baidu.bce.plat.webframework.BceServiceApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Created by newfarking on 15/11/1.
 */
@Configuration
@EnableAutoConfiguration
@ComponentScan(basePackages = {"com.newfarking.hpels.*"})
public class HpelsWebApplication {

    public static void main(String[] args) throws Exception {
        BceServiceApplication.run(HpelsWebApplication.class, args);
    }
}