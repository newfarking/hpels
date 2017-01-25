package com.newfarking.hpels.model;

import java.util.Date;

/**
 * Created by newfarking on 15/11/2.
 */
public class Rank implements Comparable {
    public int id;
    public String username;
    public String userId;
    public int useTime;
    public Date createTime;
    public String records;

    public Rank(int id, String username, String userId, int useTime, Date createTime, String records) {
        this.id = id;
        this.username = username;
        this.userId = userId;
        this.useTime = useTime;
        this.createTime = createTime;
        this.records = records;
    }

    @Override
    public int compareTo(Object o) {
        Rank other = (Rank) o;
        if (useTime != other.useTime) {
            return useTime - other.useTime;
        } else {
            return createTime.compareTo(other.createTime);
        }
    }
}
