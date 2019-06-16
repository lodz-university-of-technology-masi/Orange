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
    @JoinColumn
    private Question question;

    @ManyToOne
    @JoinColumn
    private QuestionTranslation questionTranslation;

    private String content;
}
