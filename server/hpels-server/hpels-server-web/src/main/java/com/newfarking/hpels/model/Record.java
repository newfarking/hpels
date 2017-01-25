package com.newfarking.hpels.model;

import java.util.List;

/**
 * Created by newfarking on 15/11/29.
 */
public class Record {
    public List<String> _tetrisRecords;
    public List<Motion> _motionRecords;
    public Boolean _rewardOpen;
    public static class Motion {
        public int _frameIndex;
        public String _motion;
    }
}
