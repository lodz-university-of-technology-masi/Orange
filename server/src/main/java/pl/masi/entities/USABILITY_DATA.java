package pl.masi.entities;

import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "\"USABILITY_DATA\"")
public class USABILITY_DATA {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "optimized-sequence")
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(name = "\"IP\"")
    private String IP;
    @Column(name = "\"BROWSER\"")
    private String BROWSER;
    @Column(name = "\"USERNAME\"")
    private String USERNAME;
    @Column(name = "\"M_ID\"")
    private int M_ID;
    @Column(name = "\"SAVETIME\"")
    private double SAVETIME;
    @Column(name = "\"RES_W\"")
    private int RES_W;
    @Column(name = "\"RES_H\"")
    private int RES_H;
    @Column(name = "\"MC\"")
    private int MC;
    @Column(name = "\"TIME\"")
    private double TIME;
    @Column(name = "\"DIST\"")
    private int DIST;
    @Column(name = "\"FAIL\"")
    private boolean FAIL;
    @Column(name = "\"ERROR\"")
    private String ERROR;
}
