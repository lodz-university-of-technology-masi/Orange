package pl.masi.entities;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Choice implements Serializable {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "optimized-sequence")
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = true)
    private Question question;

    @ManyToOne
    @JoinColumn(name="question_translation", nullable = true)
    private QuestionTranslation questionTranslation;

    private String content;
}
