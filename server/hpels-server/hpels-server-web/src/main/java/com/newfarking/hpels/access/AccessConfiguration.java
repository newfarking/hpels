package com.newfarking.hpels.access;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by newfarking on 15/11/1.
 */
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
@Configuration
public class AccessConfiguration extends WebMvcConfigurerAdapter {
    public void addInterceptors(InterceptorRegistry registry) {

        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/**");
    }
}
