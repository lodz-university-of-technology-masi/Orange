package pl.masi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionAnswer implements Serializable {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "optimized-sequence")
    private Long id;

    @ManyToOne
    @JoinColumn
    private TestResolution testResolution;

    @ManyToOne
    @JoinColumn
    private Question question;

    private String content;
}
