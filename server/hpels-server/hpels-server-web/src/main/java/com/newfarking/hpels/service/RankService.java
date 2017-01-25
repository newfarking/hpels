package com.newfarking.hpels.service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.newfarking.hpels.dao.RankDao;
import com.newfarking.hpels.model.Rank;
import com.newfarking.hpels.model.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by newfarking on 15/11/2.
 */
@Service
public class RankService {

    @Autowired
    RankDao rankDao;

    public List<Rank> getRanks(Boolean reward) throws IOException {

        Map<String, Rank> rankMap = new HashMap<>();

        for (Rank rank : rankDao.listRanks(10000)) {

            ObjectMapper objectMapper = new ObjectMapper();
            Record record = objectMapper.readValue(rank.records, Record.class);

            if (reward && (record._rewardOpen == null || record._rewardOpen)
                    || !reward && (record._rewardOpen != null && record._rewardOpen == false)) {

                Rank r = rankMap.get(rank.userId);
                if (r != null) {
                    if (r.useTime > rank.useTime
                            || (r.useTime == rank.useTime && r.createTime.compareTo(rank.createTime) > 0)) {
                        rankMap.put(rank.userId, rank);
                    }
                } else {
                    rankMap.put(rank.userId, rank);
                }
            }
        }

        List<Rank> ret = new ArrayList<>();
        for (Rank r : rankMap.values()) {
            ret.add(r);
        }
        Collections.sort(ret);
        return ret;
    }

    public Rank getRank(String id) {
        return rankDao.getRank(id).get(0);
    }

    public void insertRank(Rank rank) {
        rankDao.insertRank(rank);
    }
}
