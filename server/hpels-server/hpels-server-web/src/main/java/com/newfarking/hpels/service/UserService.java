package com.newfarking.hpels.service;

import com.baidu.api.domain.User;

/**
 * Created by newfarking on 15/11/1.
 */
public class UserService {
    public static ThreadLocal<User> subjectToken = new ThreadLocal<User>();
    public static ThreadLocal<String> redirectUrl = new ThreadLocal<String>();
}
