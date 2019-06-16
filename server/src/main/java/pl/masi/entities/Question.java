package pl.masi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import pl.masi.enums.QuestionType;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Objects;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE, generator = "optimized-sequence")
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @NotNull
    private String content;

    @JsonIgnore
    @ManyToMany(mappedBy = "questions")
    private List<Test> tests;

    @JsonIgnore
    @OneToMany(mappedBy = "question")
    private List<QuestionTranslation> questionTranslations;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "question_type")
    private QuestionType questionType;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Question question = (Question) o;
        return Objects.equals(name, question.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
