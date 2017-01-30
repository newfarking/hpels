package com.newfarking.hpels.controller;

import com.baidu.api.domain.User;
import com.newfarking.hpels.model.Rank;
import com.newfarking.hpels.service.RankService;
import com.newfarking.hpels.service.UserInfo;
import com.newfarking.hpels.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Created by newfarking on 15/11/1.
 */
@Controller
public class HomeController {

    @Autowired
    RankService rankService;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(Map<String, Object> model) throws IOException {
        User info = UserService.subjectToken.get();

        if (info == null) {
            model.put("username", "<a href='" + UserService.redirectUrl.get() + "'>登录</a>");
        } else {

            String username = info.getUname();
            if (username.length() == 0) {
                username = String.valueOf(info.getUid());
            }

            model.put("username", username);
        }

        model.put("ranks", getRankHtml(rankService.getRanks()));
        return "index";
    }

    public String getRankHtml(Collection<Rank> ranks) {
        StringBuilder stringBuilder = new StringBuilder();

        int index = 1;
        for (Rank rank : ranks) {

            String username = rank.username.length() == 0 ? rank.userId : rank.username;

            stringBuilder.append(
                    "<div style=\"overflow:auto;margin-top:5px\"><div style=\"float:left;overflow:auto;\"> "
                            + index + ". "
                            + username + " <span style=\"color:red\">" + rank.useTime +
                            "s</span> <a href=\"#\" onclick=\"gameScene._layer.startReplay('" + rank.id + "', true)\" style=\"font-size:6px;\">观看录像</a></div></div>");
            index ++;
        }
        return stringBuilder.toString();
    }
}
