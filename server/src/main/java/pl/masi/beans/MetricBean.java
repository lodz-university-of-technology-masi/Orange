package pl.masi.beans;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetricBean {
    private String ip;
    private String browser;
    private String username;
    private int m_id;
    private double savetime;
    private int res_w;
    private int res_h;
    private int mc;
    private double time;
    private int dist;
    private boolean fail;
    private String error;
}
