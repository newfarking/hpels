package com.newfarking.hpels.model;

/**
 * Created by newfarking on 15/11/7.
 */
public class RankForFE {
    public int id;
    public String username;
    public String userId;
    public int useTime;

    public RankForFE(Rank rank) {
        this.id = rank.id;
        this.userId = rank.userId;
        this.username = rank.username;
        this.useTime = rank.useTime;
    }
}
