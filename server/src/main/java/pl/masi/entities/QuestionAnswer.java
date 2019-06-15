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
@Table(name="question_answer")
public class QuestionAnswer implements Serializable {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "optimized-sequence")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_resolution")
    private TestResolution testResolution;

    @ManyToOne
    @JoinColumn
    private Question question;

    private String content;
}
