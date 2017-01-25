package com.newfarking.hpels.access;

import com.baidu.api.Baidu;
import com.baidu.api.BaiduApiClient;
import com.baidu.api.BaiduApiException;
import com.baidu.api.BaiduOAuthException;
import com.baidu.api.domain.Session;
import com.baidu.api.domain.User;
import com.baidu.api.service.IUserService;
import com.baidu.api.service.impl.UserServiceImpl;
import com.baidu.api.store.BaiduCookieStore;
import com.baidu.api.store.BaiduStore;
import com.newfarking.hpels.service.UserInfo;
import com.newfarking.hpels.service.UserService;
import com.newfarking.hpels.utils.SecureHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by newfarking on 15/11/1.
 */
public class LoginInterceptor extends HandlerInterceptorAdapter {
    private static final Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        UserService.subjectToken.remove();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String token = getAccessToken(response, request);

        if (token == null) {
            BaiduStore store = new BaiduCookieStore(BaiduAppConstant.CLIENTID, request, response);
            Baidu baidu = null;
            try {
                baidu = new Baidu(BaiduAppConstant.CLIENTID, BaiduAppConstant.CLIENTSECRET,
                        BaiduAppConstant.REDIRECTURI, store, request);
                String state = baidu.getState();

                User loginUser = baidu.getLoggedInUser();
                if (loginUser != null) {
                    UserService.subjectToken.set(loginUser);
                    setCookie(response, String.valueOf(loginUser.getUid()));
                    return true;
                }

                Map<String, String> params = new HashMap<String, String>();
                params.put("state", state);
                String authorizeUrl = baidu.getBaiduOAuth2Service().getAuthorizeUrl(params);
                UserService.redirectUrl.set(authorizeUrl);
                // response.sendRedirect(authorizeUrl);
            } catch (BaiduOAuthException e) {
                logger.debug("BaiduOAuthException ", e);
            } catch (BaiduApiException e) {
                logger.debug("BaiduApiException ", e);
            }
            return true;
        }

        IUserService userService = new UserServiceImpl(new BaiduApiClient(token));

        User loggedInUser = null;
        try {
            loggedInUser = userService.getLoggedInUser();
        } catch (BaiduApiException e) {

        }

        UserService.subjectToken.set(loggedInUser);
        setCookie(response, String.valueOf(loggedInUser.getUid()));
        return true;
    }

    public static String SECRET = "19920908";
    public String splitStr = "|";

    private void setCookie(HttpServletResponse response, String userId) {

        String value = userId + splitStr +
                SecureHelper.MD5(userId + SECRET);
        Cookie cookie = new Cookie("hpels-0908", value);
        response.addCookie(cookie);
    }

    private String getAccessToken(HttpServletResponse response, HttpServletRequest request) {
        BaiduStore store = new BaiduCookieStore(BaiduAppConstant.CLIENTID, request, response);
        Session session = store.getSession();
        if (session == null) {
            return null;
        }
        return session.getToken().getAccessToken();
    }
}
