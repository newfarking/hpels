package com.newfarking.hpels.controller;

import com.baidu.bce.plat.webframework.model.edp.EdpPageResultResponse;
import com.baidu.bce.plat.webframework.model.edp.EdpResultResponse;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.newfarking.hpels.access.LoginInterceptor;
import com.newfarking.hpels.model.Rank;
import com.newfarking.hpels.model.RankForFE;
import com.newfarking.hpels.model.Record;
import com.newfarking.hpels.service.RankService;
import com.newfarking.hpels.service.UserService;
import com.newfarking.hpels.utils.SecureHelper;
import com.wordnik.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Created by newfarking on 15/11/1.
 */
@RestController
@RequestMapping("/")
public class UserInfoController {

    @Autowired
    RankService rankService;

    @RequestMapping(value = "/getRank/{id}", method = RequestMethod.GET)
    public EdpResultResponse<Rank> getRank(@PathVariable String id) {
        return new EdpResultResponse<Rank>().withResult(
                rankService.getRank(id)
        );
    }

    @RequestMapping(value = "/getRanks", method = RequestMethod.POST, params = "reward")
    public EdpPageResultResponse<RankForFE> getRanks(@RequestParam int reward) throws IOException {

        Collection<Rank> ranks = rankService.getRanks(reward == 1);

        List<RankForFE> ranksForFE = new ArrayList<>();
        for (Rank rank : ranks) {
            ranksForFE.add(new RankForFE(rank));
        }

        return new EdpPageResultResponse<RankForFE>()
                .withPage(new EdpPageResultResponse.Page<RankForFE>()
                        .withResult(ranksForFE));
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public void uploadScore(@RequestParam String time, @RequestParam String records) {
        rankService.insertRank(new Rank(0, "test", "34",
               12, null, "2323"));
        if (!check(time)) {
            return;
        }

        String username = UserService.subjectToken.get().getUname();
        if (username.length() == 0) {
            username = String.valueOf(UserService.subjectToken.get().getUid());
        }
        rankService.insertRank(new Rank(0, username, time.split("\\|")[0],
                Integer.parseInt(time.split("\\|")[2]), null, records));
    }

    private static boolean check(String data) {
        // data:user_id|md5|time|md5

        String[] params = data.split("\\|");
        if (params.length != 4) {
            return false;
        }


        if (!params[1].equals(SecureHelper.MD5(params[0] + LoginInterceptor.SECRET))) {
            return false;
        }

        return params[3].equals(SecureHelper.MD5(params[0] + "|" + params[1]
                + params[2] + LoginInterceptor.SECRET));

    }
}
