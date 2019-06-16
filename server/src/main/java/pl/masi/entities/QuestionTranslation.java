package pl.masi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import pl.masi.enums.QuestionType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Objects;

@Entity
@Getter @Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionTranslation {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "optimized-sequence")
    @Column(nullable = false, unique = true)
    private Long id;

    @JsonIgnore
    @OneToMany(mappedBy = "questionTranslation", cascade = { CascadeType.ALL })
    private List<Choice> choices;

    @ManyToOne
    @JoinColumn
    private Question question;

    @ManyToOne
    @JoinColumn
    private Language language;

    @NotNull
    private String content;
}
