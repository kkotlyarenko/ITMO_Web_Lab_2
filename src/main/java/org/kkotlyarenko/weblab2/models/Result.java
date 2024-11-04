package org.kkotlyarenko.weblab2.models;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

public class Result {
    private final int x;
    private final double y;
    private final double r;
    private final long timestamp;
    private final boolean hit;

    public Result(int x, double y, double r, boolean hit) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.timestamp = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);
        this.hit = hit;
    }

    public int getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public long getTimestamp() { return timestamp; }
    public boolean isHit() { return hit; }
}