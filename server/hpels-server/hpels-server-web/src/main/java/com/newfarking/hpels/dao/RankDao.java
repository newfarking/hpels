package com.newfarking.hpels.dao;

import com.newfarking.hpels.model.Rank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by newfarking on 15/11/2.
 */
@Repository
public class RankDao {

    @Autowired
    private DataSource dataSource;

    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @PostConstruct
    public void initJdbcTemplate() {
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }


    public List<Rank> listRanks(int limit) {

        String sql = "select * from rank order by useTime,create_time limit " + limit;

        final List<Rank> ranks = new ArrayList<>();

        Map<String, String> args = new HashMap<>();

        namedParameterJdbcTemplate.query(sql, args,
                new RowCallbackHandler() {
                    @Override
                    public void processRow(ResultSet rs) throws SQLException {
                        ranks.add(getRank(rs));
                    }
                });

        return ranks;
    }

    public List<Rank> getRank(String id) {
        String sql = "select * from rank where id=:id";

        final List<Rank> ranks = new ArrayList<>();

        Map<String, String> args = new HashMap<>();
        args.put("id", id);

        namedParameterJdbcTemplate.query(sql, args,
                new RowCallbackHandler() {
                    @Override
                    public void processRow(ResultSet rs) throws SQLException {
                        ranks.add(getRank(rs));
                    }
                });
        return ranks;
    }

    public Rank getRank(ResultSet rs) throws SQLException {
        try {
            return new Rank(rs.getInt("id"), URLDecoder.decode(rs.getString("user_name"), "UTF-8"),
                    rs.getString("user_id"), rs.getInt("useTime"),
                    rs.getTimestamp("create_time"), rs.getString("records"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void insertRank(Rank rank) {

        rank.createTime = new Date();
        SimpleJdbcInsert insert = new SimpleJdbcInsert(dataSource)
                .withTableName("rank")
                .usingColumns("user_id",
                        "user_name", "useTime", "create_time", "records");

        Map<String, Object> args = new HashMap<>();
        args.put("user_id", rank.userId);

        try {
            args.put("user_name", URLEncoder.encode(rank.username, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        args.put("useTime", rank.useTime);
        args.put("create_time", rank.createTime);
        args.put("records", rank.records);
        insert.execute(args);
    }

    public int updateRank(Rank rank) {

        String sql = "update rank set useTime=:useTime, create_time=:create_time, records=:records " +
                "where user_id=:user_id;";

        Map<String, Object> args = new HashMap<>();
        args.put("useTime", rank.useTime);
        args.put("create_time", new Date());
        args.put("user_id", rank.userId);
        args.put("records", rank.records);
        return namedParameterJdbcTemplate.update(sql, args);
    }
}

